import fs from "fs/promises";
import path from "path";

export async function readFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Failed to read file at: ${filePath}`, error);
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await fs.writeFile(filePath, content, "utf-8");
  } catch (error) {
    throw new Error(`Failed to write file: ${filePath}`);
  }
}

export async function findSpecFile(
  directories: string[] = [".", "api", "docs"]
): Promise<string | null> {
  const specFileNames = ["openapi.json", "swagger.json", "spec.json"];
  const projectRoot = process.cwd();
  for (const dir of directories) {
    for (const fileName of specFileNames) {
      const filePath = path.join(dir, fileName);
      const fullPath = path.join(projectRoot, filePath);
      try {
        const stats = await fs.stat(fullPath);
        if (stats.isFile()) {
          console.log(`Found spec file: ${fullPath}`);
          return filePath;
        }
      } catch {
        // continuing the search
      }
    }
  }
  return null;
}

export function sanitizeDirName(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}