import fs from "fs";
import path from "path";

// On Vercel, process.env.VERCEL is defined. The project directory is read-only at runtime.
// The only directory we can write to is "/tmp".
const IS_SERVERLESS = !!process.env.VERCEL;
const READ_DIR = path.join(process.cwd(), "data");
const WRITE_DIR = IS_SERVERLESS ? "/tmp/data" : READ_DIR;

function getWritePath(filePath: string): string {
  const fileName = path.basename(filePath);
  return path.join(WRITE_DIR, fileName);
}

/**
 * Ensures that the data directory and the target JSON file exist.
 * Reads from the read-only project folder if initializing the file for the first time.
 */
function ensureDataFile(filePath: string): string {
  const targetPath = getWritePath(filePath);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!fs.existsSync(targetPath)) {
    // If the file exists in the read-only build directory, copy it over to /tmp
    const originalPath = path.join(READ_DIR, path.basename(filePath));
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
 * Reads and parses a JSON file containing a list of items.
 */
export function readJsonFile<T>(filePath: string): T[] {
  const targetPath = ensureDataFile(filePath);
  try {
    const fileContent = fs.readFileSync(targetPath, "utf-8");
    return JSON.parse(fileContent || "[]") as T[];
  } catch (error) {
    console.error(`Failed to read JSON file at ${targetPath}:`, error);
    throw error;
  }
}

/**
 * Serializes and writes a list of items to a JSON file.
 */
export function writeJsonFile<T>(filePath: string, items: T[]): void {
  const targetPath = ensureDataFile(filePath);
  try {
    fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write JSON file at ${targetPath}:`, error);
    throw error;
  }
}
