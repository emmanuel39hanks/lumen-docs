import { loadConfig } from "../utils/load-config";
import { generateMarkdownFiles } from "../services/markdown";
import { parseOpenAPISpec } from "../utils/openapi-parser";
import {
  saveSpecVersion,
  loadPreviousSpec,
  findChangedEndpoints,
  getNextVersionNumber,
} from "../utils/versioning";
import { createSpinner } from "./spinner";
import { promptForApiKey, promptForSpecFile } from "./prompts";
import { handleError } from "../utils/error-handler";
import { OpenAPISpec } from "../types";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import inquirer from "inquirer";

dotenv.config();

export async function generateDocumentation() {
  const config = loadConfig();

  if (!process.env.OPENAI_API_KEY) {
    const apiKey = await promptForApiKey();
    process.env.OPENAI_API_KEY = apiKey;
    await fs.appendFile(".env", `\nOPENAI_API_KEY=${apiKey}`);
  }

  if (config.gitbookDeploy.enabled && !process.env.GITBOOK_API_KEY) {
    const gitbookApiKey = await inquirer.prompt([
      {
        type: "input",
        name: "gitbookApiKey",
        message: "Enter your GitBook API key:",
      },
    ]);
    process.env.GITBOOK_API_KEY = gitbookApiKey.gitbookApiKey;
    await fs.appendFile(
      ".env",
      `\nGITBOOK_API_KEY=${gitbookApiKey.gitbookApiKey}`
    );
  }

  if (config.gitbookDeploy.enabled && !process.env.GITBOOK_SPACE_ID) {
    const gitbookSpaceId = await inquirer.prompt([
      {
        type: "input",
        name: "gitbookSpaceId",
        message: "Enter your GitBook Space ID:",
      },
    ]);
    process.env.GITBOOK_SPACE_ID = gitbookSpaceId.gitbookSpaceId;
    await fs.appendFile(
      ".env",
      `\nGITBOOK_SPACE_ID=${gitbookSpaceId.gitbookSpaceId}`
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
      config.api || ""
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
