import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Support both Vercel KV and Upstash Redis env variable naming conventions
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const USE_KV = !!(KV_URL && KV_TOKEN);

// Fallback directory for serverless environments (read-only filesystem)
const IS_SERVERLESS = !!process.env.VERCEL;
const FALLBACK_WRITE_DIR = IS_SERVERLESS ? "/tmp/data" : DATA_DIR;

function getKvKey(filePath: string): string {
  return path.basename(filePath, ".json");
}

function getFallbackWritePath(filePath: string): string {
  return path.join(FALLBACK_WRITE_DIR, path.basename(filePath));
}

/**
 * Ensures that the local fallback database file exists.
 */
function ensureLocalDataFile(filePath: string): string {
  const targetPath = getFallbackWritePath(filePath);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!fs.existsSync(targetPath)) {
    // If the file exists in the read-only build directory, copy it over
    const originalPath = path.join(DATA_DIR, path.basename(filePath));
    if (fs.existsSync(originalPath)) {
      try {
        fs.copyFileSync(originalPath, targetPath);
      } catch (err) {
        console.error(`Failed to copy database file from ${originalPath} to ${targetPath}:`, err);
        fs.writeFileSync(targetPath, JSON.stringify([]), "utf-8");
      }
    } else {
      fs.writeFileSync(targetPath, JSON.stringify([]), "utf-8");
    }
  }

  return targetPath;
}

/**
 * Reads a JSON list from Vercel KV (if configured) or fallback file.
 */
export async function readJsonFile<T>(filePath: string): Promise<T[]> {
  if (USE_KV) {
    const key = getKvKey(filePath);
    const url = `${KV_URL}/get/${key}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`KV response error: ${res.statusText}`);
      const payload = await res.json();
      const resultStr = payload.result;
      if (!resultStr) {
        // If the key doesn't exist in KV, load from the local source file and write it to KV
        const localData = readLocalJsonFile<T>(filePath);
        await writeJsonFile<T>(filePath, localData);
        return localData;
      }
      return JSON.parse(resultStr) as T[];
    } catch (error) {
      console.error(`Failed to read from Vercel KV for key ${key}, falling back to file:`, error);
      return readLocalJsonFile<T>(filePath);
    }
  } else {
    return readLocalJsonFile<T>(filePath);
  }
}

/**
 * Writes a JSON list to Vercel KV (if configured) or fallback file.
 */
export async function writeJsonFile<T>(filePath: string, items: T[]): Promise<void> {
  if (USE_KV) {
    const key = getKvKey(filePath);
    const url = `${KV_URL}/set/${key}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(items)), // We store the stringified array in Redis
      });
      if (!res.ok) throw new Error(`KV set error: ${res.statusText}`);
    } catch (error) {
      console.error(`Failed to write to Vercel KV for key ${key}, falling back to file:`, error);
      writeLocalJsonFile<T>(filePath, items);
    }
  } else {
    writeLocalJsonFile<T>(filePath, items);
  }
}

// Local filesystem helpers
function readLocalJsonFile<T>(filePath: string): T[] {
  const targetPath = ensureLocalDataFile(filePath);
  try {
    const fileContent = fs.readFileSync(targetPath, "utf-8");
    return JSON.parse(fileContent || "[]") as T[];
  } catch (error) {
    console.error(`Failed to read local JSON file at ${targetPath}:`, error);
    return [];
  }
}

function writeLocalJsonFile<T>(filePath: string, items: T[]): void {
  const targetPath = ensureLocalDataFile(filePath);
  try {
    fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write local JSON file at ${targetPath}:`, error);
  }
}
