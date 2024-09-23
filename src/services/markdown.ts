import fs from "fs/promises";
import path from "path";
import {
  generateEndpointDescription,
  generateIntroduction,
  generateResourceOverview,
} from "./openai";
import { ParsedEndpoint } from "../types";

export async function generateMarkdownFiles(
  groupedEndpoints: Record<string, ParsedEndpoint[]>,
  versionNumber: number
): Promise<void> {
  const currentOutputDir = path.join(process.cwd(), "lumen-docs", "docs");
  const versionedOutputDir = path.join(
    process.cwd(),
    "lumen-docs",
    "versions",
    "docs",
    `v${versionNumber}`
  );

  await fs.rm(currentOutputDir, { recursive: true, force: true });
  await fs.mkdir(currentOutputDir, { recursive: true });
  await fs.mkdir(versionedOutputDir, { recursive: true });

  let summaryContent = "# Summary\n\n";

  const gettingStartedDir = path.join(currentOutputDir, "getting-started");
  await fs.mkdir(gettingStartedDir, { recursive: true });
  await createGettingStartedFiles(gettingStartedDir);
  summaryContent += "* [Introduction](introduction.md)\n";
  summaryContent += "* [Getting Started](getting-started/README.md)\n";
  summaryContent += "  * [Installation](getting-started/installation.md)\n";
  summaryContent += "  * [Authentication](getting-started/authentication.md)\n";
  summaryContent +=
    "  * [Making Requests](getting-started/making-requests.md)\n\n";

  summaryContent += "* [API Reference](api-reference/README.md)\n";

  for (const [resource, endpoints] of Object.entries(groupedEndpoints)) {
    const resourceDir = path.join(
      currentOutputDir,
      "api-reference",
      sanitizeDirName(resource)
    );
    const versionedResourceDir = path.join(
      versionedOutputDir,
      "api-reference",
      sanitizeDirName(resource)
    );

    await fs.mkdir(resourceDir, { recursive: true });
    await fs.mkdir(versionedResourceDir, { recursive: true });

    summaryContent += `  * [${resource}](api-reference/${sanitizeDirName(
      resource
    )}/README.md)\n`;

    const resourceOverview = await generateResourceOverview(
      resource,
      endpoints
    );
    await fs.writeFile(path.join(resourceDir, "README.md"), resourceOverview);
    await fs.writeFile(
      path.join(versionedResourceDir, "README.md"),
      resourceOverview
    );

    for (const endpoint of endpoints) {
      const fileName = getEndpointFileName(endpoint.method, endpoint.path);
      const filePath = path.join(resourceDir, fileName);
      const versionedFilePath = path.join(versionedResourceDir, fileName);

      const content = await generateEndpointDescription(endpoint);
      await fs.writeFile(filePath, content);
      await fs.writeFile(versionedFilePath, content);
      console.log(
        `Generated documentation for ${resource} - ${endpoint.title}: ${filePath}`
      );

      summaryContent += `    * [${
        endpoint.title
      }](api-reference/${sanitizeDirName(resource)}/${fileName})\n`;
    }
    summaryContent += "\n";
  }

  await fs.writeFile(path.join(currentOutputDir, "SUMMARY.md"), summaryContent);

  const introductionContent = await generateIntroduction();
  await fs.writeFile(
    path.join(currentOutputDir, "introduction.md"),
    introductionContent
  );
}

async function createGettingStartedFiles(
  gettingStartedDir: string
): Promise<void> {
  const files = [
    {
      name: "README.md",
      content: `# Getting Started

Welcome to our API documentation! This section will guide you through the process of setting up and using our API.

## Contents

1. [Installation](installation.md): Set up your development environment.
2. [Authentication](authentication.md): Learn how to authenticate your API requests.
3. [Making Requests](making-requests.md): Understand how to structure and send API requests.

Let's get started with integrating our API into your application!`,
    },
    {
      name: "installation.md",
      content: `# Installation

This guide will help you set up your development environment to use our API.

## Prerequisites

- A modern web browser
- An HTTP client (like cURL or Postman) for testing API requests
- Your preferred programming language and development environment

## Getting Your API Key

1. Sign up for an account on our developer portal
2. Navigate to the API Keys section
3. Generate a new API key
4. Store your API key securely - you'll need it for all API requests

## Next Steps

Once you have your API key, proceed to the [Authentication](authentication.md) guide to learn how to use it in your requests.`,
    },
    {
      name: "authentication.md",
      content: `# Authentication

Our API uses API keys for authentication. You must include your API key in every request to authenticate.

## Using Your API Key

Include your API key in the Authorization header of your HTTP requests:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

Replace \`YOUR_API_KEY\` with the actual API key you obtained from our developer portal.

## Security Best Practices

- Keep your API key confidential
- Don't hardcode your API key in your source code
- Use environment variables or a secure key management system to store your API key
- Rotate your API key periodically for enhanced security

## Next Steps

Now that you understand how to authenticate your requests, move on to [Making Requests](making-requests.md) to learn how to interact with our API endpoints.`,
    },
    {
      name: "making-requests.md",
      content: `# Making Requests

This guide explains how to structure and send requests to our API.

## Base URL

All API requests should be made to:

\`\`\`
https://api.example.com/v1
\`\`\`

## Request Format

Our API accepts JSON-encoded request bodies. Set the following headers for your requests:

- \`Content-Type: application/json\`
- \`Authorization: Bearer YOUR_API_KEY\`

## Common HTTP Methods

- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources

## Example Request

Here's an example of how to make a GET request to retrieve a list of items:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/v1/items
\`\`\`

## Handling Responses

Our API returns JSON-encoded responses. Always check the HTTP status code to determine the outcome of your request.

## Rate Limiting

To ensure fair usage, our API implements rate limiting. Check the \`X-RateLimit-Remaining\` header in the API response to monitor your current rate limit status.

## Next Steps

Explore our API Reference section for detailed information on all available endpoints and operations.`,
    },
  ];

  for (const file of files) {
    await fs.writeFile(path.join(gettingStartedDir, file.name), file.content);
  }
}

function sanitizeDirName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");
}

function getEndpointFileName(method: string, path: string): string {
  const operation = getOperationType(method, path);
  const resourceName = path.split("/")[1].toLowerCase();
  return `${operation}-${resourceName}.md`;
}

function getOperationType(method: string, path: string): string {
  if (method === "POST") return "create";
  if (method === "GET" && !path.includes("{")) return "get-all";
  if (method === "GET") return "get-single";
  if (method === "PUT" || method === "PATCH") return "update";
  if (method === "DELETE") return "delete";
  return "other";
}