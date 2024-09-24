import { loadConfig } from "../utils/load-config";
import { generateMarkdownFiles } from "../services/markdown";
import { parseOpenAPISpec } from "../utils/openapi-parser";
import {
  saveSpecVersion,
  loadPreviousSpec,
  findChangedEndpoints,
  getNextVersionNumber,
} from "../utils/versioning";
import { createSpinner } from "../utils/spinner";
import { promptForApiKey, promptForSpecFile } from "./prompts";
import { handleError } from "../utils/error-handler";
import { OpenAPISpec } from "../types";
import fs from "fs/promises";
import prompts from "prompts";

export async function generateDocumentation() {
  const config = loadConfig();

  if (!process.env.LUMEN_DOCS_OPENAI_API_KEY) {
    const apiKey = await promptForApiKey();
    process.env.LUMEN_DOCS_OPENAI_API_KEY = apiKey;
    await fs.appendFile(".env", `\nLUMEN_DOCS_OPENAI_API_KEY=${apiKey}`);
  }

  if (config.gitbookDeploy.enabled && !process.env.LUMEN_DOCS_GITBOOK_API_KEY) {
    const gitbookApiKey = await prompts([
      {
        type: "text",
        name: "gitbookApiKey",
        message: "Enter your GitBook API key:",
      },
    ]);
    process.env.LUMEN_DOCS_GITBOOK_API_KEY = gitbookApiKey.gitbookApiKey;
    await fs.appendFile(
      ".env",
      `\nLUMEN_DOCS_GITBOOK_API_KEY=${gitbookApiKey.gitbookApiKey}`
    );
  }

  if (config.gitbookDeploy.enabled && !process.env.LUMEN_DOCS_GITBOOK_SPACE_ID) {
    const gitbookSpaceId = await prompts([
      {
        type: "text",
        name: "gitbookSpaceId",
        message: "Enter your GitBook Space ID:",
      },
    ]);
    process.env.LUMEN_DOCS_GITBOOK_SPACE_ID = gitbookSpaceId.gitbookSpaceId;
    await fs.appendFile(
      ".env",
      `\nLUMEN_DOCS_GITBOOK_SPACE_ID=${gitbookSpaceId.gitbookSpaceId}`
    );
  }

  const specFile = await promptForSpecFile();

  const spinner = createSpinner("Generating documentation...");
  spinner.start();

  try {
    const specData = await fs.readFile(specFile, "utf-8");
    const currentSpec = JSON.parse(specData) as OpenAPISpec;

    const versionNumber = await getNextVersionNumber();
    const previousSpec = await loadPreviousSpec(versionNumber - 1);
    const changedEndpoints = previousSpec
      ? findChangedEndpoints(previousSpec, currentSpec)
      : Object.keys(currentSpec.paths);

    const parsedSpec = await parseOpenAPISpec(
      currentSpec,
      config.openai.apiKey || ""
    );
    await generateMarkdownFiles(
      parsedSpec,
      versionNumber
    );
    await saveSpecVersion(currentSpec, versionNumber);

    spinner.success({ text: "Documentation generated successfully!" });
  } catch (error) {
    handleError(error, spinner);
  }
}
