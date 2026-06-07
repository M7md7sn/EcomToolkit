import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// If Vercel KV env variables are linked to the project, Vercel injects these automatically
const USE_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

function getKvKey(filePath: string): string {
  return path.basename(filePath, ".json");
}

/**
 * Ensures that the local data directory and the target JSON file exist (for local environment).
 */
function ensureLocalDataFile(filePath: string): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
  }
}

/**
 * Reads a JSON list from Vercel KV (if configured) or local file.
 */
export async function readJsonFile<T>(filePath: string): Promise<T[]> {
  if (USE_KV) {
    const key = getKvKey(filePath);
    const url = `${process.env.KV_REST_API_URL}/get/${key}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
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
 * Writes a JSON list to Vercel KV (if configured) or local file.
 */
export async function writeJsonFile<T>(filePath: string, items: T[]): Promise<void> {
  if (USE_KV) {
    const key = getKvKey(filePath);
    const url = `${process.env.KV_REST_API_URL}/set/${key}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
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
  ensureLocalDataFile(filePath);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent || "[]") as T[];
  } catch (error) {
    console.error(`Failed to read local JSON file at ${filePath}:`, error);
    return [];
  }
}

function writeLocalJsonFile<T>(filePath: string, items: T[]): void {
  ensureLocalDataFile(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write local JSON file at ${filePath}:`, error);
  }
}
