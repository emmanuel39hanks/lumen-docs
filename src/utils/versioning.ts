import fs from "fs/promises";
import path from "path";
import { OpenAPISpec, PathItem, Operation } from "../types";

export async function saveSpecVersion(
  spec: OpenAPISpec,
  versionNumber: number
): Promise<void> {
  const versionDir = path.join(
    process.cwd(),
    "lumen-docs",
    "versions",
    "specs"
  );
  await fs.mkdir(versionDir, { recursive: true });
  await fs.writeFile(
    path.join(versionDir, `openapi-v${versionNumber}.json`),
    JSON.stringify(spec, null, 2)
  );
}

export async function loadPreviousSpec(
  versionNumber: number
): Promise<OpenAPISpec | null> {
  const versionDir = path.join(
    process.cwd(),
    "lumen-docs",
    "versions",
    "specs"
  );
  const filePath = path.join(versionDir, `openapi-v${versionNumber}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as OpenAPISpec;
  } catch (error) {
    return null;
  }
}

export function findChangedEndpoints(
  previousSpec: OpenAPISpec,
  currentSpec: OpenAPISpec
): string[] {
  const changedEndpoints: string[] = [];

  for (const [path, pathItem] of Object.entries<PathItem>(currentSpec.paths)) {
    for (const [method, operation] of Object.entries<Operation>(pathItem)) {
      if (method === "parameters") continue;

      const previousOperation = previousSpec.paths[path]?.[method] as
        | Operation
        | undefined;
      if (
        !previousOperation ||
        JSON.stringify(operation) !== JSON.stringify(previousOperation)
      ) {
        changedEndpoints.push(`${method.toUpperCase()} ${path}`);
      }
    }
  }

  return changedEndpoints;
}

export async function getNextVersionNumber(): Promise<number> {
  const versionDir = path.join(process.cwd(), "lumen-docs", "versions", "specs");
  const files = await fs.readdir(versionDir);
  const versionNumbers = files
    .filter(file => file.startsWith("openapi-v") && file.endsWith(".json"))
    .map(file => parseInt(file.replace("openapi-v", "").replace(".json", "")));
  return versionNumbers.length > 0 ? Math.max(...versionNumbers) + 1 : 1;
}