import inquirer from "inquirer";
import { DEFAULT_SPEC_FILE } from "../config/constants";
import fs from "fs/promises";
import path from "path";
import { findSpecFile } from "../utils/file";

export async function promptForApiKey(): Promise<string> {
  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: `Please enter your OpenAI API key:`,
      validate: (input) => input.length > 0 || "API key is required",
    },
  ]);
  return apiKey;
}

export async function promptForSpecFile(): Promise<string> {
  const detectedSpecFile = await findSpecFile();

  if (detectedSpecFile) {
    const { useDetectedFile } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useDetectedFile",
        message: `Auto-detected spec file at ${detectedSpecFile}. Do you want to use this file?`,
        default: true,
      },
    ]);

    if (useDetectedFile) {
      const fullPath = path.resolve(process.cwd(), detectedSpecFile);
      try {
        await fs.access(fullPath);
        return fullPath;
      } catch (error) {
        console.error(error);
      }
    }
  }

  const { specFile } = await inquirer.prompt([
    {
      type: "input",
      name: "specFile",
      message: "Where is your OpenAPI spec file located?",
      default: DEFAULT_SPEC_FILE,
      validate: async (input) => {
        const fullPath = path.resolve(process.cwd(), input);
        try {
          await fs.access(fullPath);
          return true;
        } catch (error) {
          console.error(error);
          return "File not found. Please enter a valid file path.";
        }
      },
    },
  ]);

  return path.resolve(process.cwd(), specFile);
}
