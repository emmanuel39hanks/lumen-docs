import OpenAI from "openai";
import { Operation, ParsedEndpoint } from "../types";
import { formatJSON } from "../utils/openapi-parser";
import { loadConfig } from "../utils/load-config";

const config = loadConfig();

export async function generateCategory(
  tags: string[],
  operation: Operation
): Promise<string> {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });


  const prompt = `Given the following API operation details, provide a single, concise resource name that this operation acts upon. The resource name should be in plural form and use Title Case (e.g., "Food Items" instead of "Food Item" or "food item").

Tags: ${tags.join(", ")}
Summary: ${operation.summary}
Description: ${operation.description}

Resource Name:`;

  try {
    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that identifies the main resource an API operation acts upon.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 10,
      n: 1,
      temperature: 0.5,
    });

    return completion.choices[0].message.content?.trim() || "Uncategorized";
  } catch (error) {
    console.error("Error generating category:", error);
    return "Uncategorized";
  }
}

export async function generateTitle(
  method: string,
  path: string,
  operation: Operation,
): Promise<string> {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const prompt = `Given this API operation: Method: ${method.toUpperCase()}, Path: ${path}, Summary: ${
    operation.summary
  }, generate a concise and descriptive title for the documentation page.`;

  const completion = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    `${method.toUpperCase()} ${path}`
  );
}


export async function generateResourceOverview(
  resource: string,
  endpoints: ParsedEndpoint[],
): Promise<string> {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });

  const prompt = `Generate an overview for the ${resource} API. Include:
1. A brief description of what ${resource} represents in the system.
2. A list of available endpoints for ${resource}, with a short description for each.
3. Any important notes or considerations for using the ${resource} API.

Use markdown formatting. The output should be concise yet informative.`;

  const completion = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return (
    completion.choices[0].message.content ||
    `# ${resource} API\n\nOverview of ${resource} API endpoints.`
  );
}

export async function generateEndpointDescription(
  endpoint: ParsedEndpoint,
): Promise<string> {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });

  const prompt = `Generate detailed documentation for the following API endpoint:

Method: ${endpoint.method}
Path: ${endpoint.path}
Summary: ${endpoint.summary}
Description: ${endpoint.description}

Parameters: ${JSON.stringify(endpoint.parameters, null, 2)}
Request Body: ${JSON.stringify(endpoint.requestBody, null, 2)}
Responses: ${JSON.stringify(endpoint.responses, null, 2)}

Please provide a detailed explanation of the endpoint, including its purpose, required parameters, request format, and possible responses. Use the following format:

# \`${endpoint.method.toUpperCase()} ${endpoint.path}\`

### Summary:
Provide a detailed summary of what this endpoint does.

### Endpoint:
- **Method**: \`${endpoint.method.toUpperCase()}\`
- **URL**: \`https://api.example.com${endpoint.path}\`

### Headers:
- **Content-Type**: \`application/json\`

### Query Parameters:
List any query parameters required for this endpoint.

### Request Body:
Provide a detailed example of the request body in JSON format.

### Expected Response:

#### Status Codes:
List the possible status codes and their meanings.

#### Response Body (example):
Provide an example of the response body in JSON format.

### Example Request:
Provide an example of how to make a request to this endpoint using curl.

### Notes:
Include any additional notes or important information about this endpoint.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: config.openai.temperature,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Incorrect API key provided")
    ) {
      throw new Error("Incorrect API key provided");
    }
    throw error;
  }
}

export async function generateIntroduction(): Promise<string> {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const prompt = `Generate an introduction for an API documentation. Include:
1. A brief overview of the API's purpose and capabilities
2. Key features of the API
3. How to navigate the documentation
4. Any important notes or considerations for users

Use markdown formatting. The output should be concise yet informative.`;

  const completion = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return (
    completion.choices[0].message.content ||
    "# Introduction\n\nWelcome to our API documentation."
  );
}
