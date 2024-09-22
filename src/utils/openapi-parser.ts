import { ParsedEndpoint, OpenAPISpec, PathItem, Operation } from "../types";
import { generateCategory, generateTitle } from "../services/openai";

export async function parseOpenAPISpec(
  spec: OpenAPISpec,
  apiKey: string
): Promise<Record<string, ParsedEndpoint[]>> {
  try {
    const endpoints: Record<string, ParsedEndpoint[]> = {};

    for (const [path, pathItem] of Object.entries<PathItem>(spec.paths)) {
      for (const [method, operation] of Object.entries<Operation>(pathItem)) {
        if (method === "parameters") continue;

        try {
          const tags = operation.tags || [];
          const category = await generateCategory(tags, operation);
          const title = await generateTitle(method, path, operation);

          const endpoint: ParsedEndpoint = {
            method: method.toUpperCase(),
            path,
            title,
            summary: operation.summary || "",
            description: operation.description || "",
            parameters: operation.parameters || [],
            requestBody: operation.requestBody,
            responses: operation.responses,
          };

          if (!endpoints[category]) endpoints[category] = [];
          endpoints[category].push(endpoint);
        } catch (innerError) {
          console.error(
            `Error processing endpoint ${method} ${path}:`,
            innerError
          );
        }
      }
    }

    return endpoints;
  } catch (error) {
    console.error("Error in parseOpenAPISpec:", error);
    throw error;
  }
}

export function formatJSON(data: any): string {
  if (!data) return "None";

  try {
    return "```json\n" + JSON.stringify(data, null, 2) + "\n```";
  } catch (error) {
    console.error("Error formatting JSON:", error);
    return "Error: Unable to format JSON";
  }
}
