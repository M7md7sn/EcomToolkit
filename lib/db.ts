import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Neon Postgres connection string from environment.
 * Set DATABASE_URL in Vercel environment variables after creating a Neon Postgres database.
 */
const DATABASE_URL = process.env.DATABASE_URL;
const USE_POSTGRES = !!DATABASE_URL;

/**
 * Get a Neon SQL tagged-template client (serverless-compatible).
 */
function getSql() {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return neon(DATABASE_URL);
}

/**
 * Derive a table name from a file path.
 * e.g., "submissions.json" → "submissions"
 */
function getTableName(filePath: string): string {
  return path.basename(filePath, ".json");
}

/**
 * Ensures that a "kv_store" table exists for bulk JSON storage.
 * This stores an entire JSON array under a single key for simplicity.
 */
async function ensureKvTable(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

/**
 * Reads a JSON list from Postgres (if configured) or local file.
 */
export async function readJsonFile<T>(filePath: string): Promise<T[]> {
  if (USE_POSTGRES) {
    const key = getTableName(filePath);
    try {
      await ensureKvTable();
      const sql = getSql();
      const rows = await sql`SELECT value FROM kv_store WHERE key = ${key}`;
      if (rows.length === 0) {
        // Key doesn't exist in Postgres yet — seed from local file
        const localData = readLocalJsonFile<T>(filePath);
        if (localData.length > 0) {
          await writeJsonFile<T>(filePath, localData);
        }
        return localData;
      }
      return rows[0].value as T[];
    } catch (error) {
      console.error(`Failed to read from Postgres for key "${key}":`, error);
      return readLocalJsonFile<T>(filePath);
    }
  } else {
    return readLocalJsonFile<T>(filePath);
  }
}

/**
 * Writes a JSON list to Postgres (if configured) or local file.
 */
export async function writeJsonFile<T>(filePath: string, items: T[]): Promise<void> {
  if (USE_POSTGRES) {
    const key = getTableName(filePath);
    try {
      await ensureKvTable();
      const sql = getSql();
      const jsonValue = JSON.stringify(items);
      await sql`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES (${key}, ${jsonValue}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${jsonValue}::jsonb, updated_at = NOW()
      `;
    } catch (error) {
      console.error(`Failed to write to Postgres for key "${key}":`, error);
      writeLocalJsonFile<T>(filePath, items);
    }
  } else {
    writeLocalJsonFile<T>(filePath, items);
  }
}

// ───────────────────────────────────────────
// Local filesystem helpers (dev environment)
// ───────────────────────────────────────────

function readLocalJsonFile<T>(filePath: string): T[] {
  try {
    const targetPath = path.join(DATA_DIR, path.basename(filePath));
    if (!fs.existsSync(targetPath)) return [];
    const fileContent = fs.readFileSync(targetPath, "utf-8");
    return JSON.parse(fileContent || "[]") as T[];
  } catch (error) {
    console.error(`Failed to read local JSON file:`, error);
    return [];
  }
}

function writeLocalJsonFile<T>(filePath: string, items: T[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const targetPath = path.join(DATA_DIR, path.basename(filePath));
    fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write local JSON file:`, error);
  }
}
