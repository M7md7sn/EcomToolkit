import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Ensures that the data directory and the target JSON file exist.
 * Defaults to initializing with an empty array if the file is missing.
 */
function ensureDataFile(filePath: string): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
  }
}

/**
 * Reads and parses a JSON file containing a list of items.
 */
export function readJsonFile<T>(filePath: string): T[] {
  ensureDataFile(filePath);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent || "[]") as T[];
  } catch (error) {
    console.error(`Failed to read JSON file at ${filePath}:`, error);
    throw error;
  }
}

/**
 * Serializes and writes a list of items to a JSON file.
 */
export function writeJsonFile<T>(filePath: string, items: T[]): void {
  ensureDataFile(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write JSON file at ${filePath}:`, error);
    throw error;
  }
}
