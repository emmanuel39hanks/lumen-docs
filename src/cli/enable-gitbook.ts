import { loadConfig } from "../utils/load-config";
import { writeFile } from "../utils/file";
import prompts from "prompts";
import path from "path";

export async function enableGitBook() {
  const config = loadConfig();

  if (config.gitbookDeploy.enabled) {
    console.log("GitBook deployment is already enabled.");
    return;
  }

  const { gitbookApiKey, gitbookSpaceId } = await prompts([
    {
      type: "text",
      name: "gitbookApiKey",
      message: "Enter your GitBook API key:",
      validate: (input) => input.length > 0 || "GitBook API key is required",
    },
    {
      type: "text",
      name: "gitbookSpaceId",
      message: "Enter your GitBook Space ID:",
      validate: (input) => input.length > 0 || "GitBook Space ID is required",
    },
  ]);

  config.gitbookDeploy.enabled = true;
  config.gitbookDeploy.gitbookApiKey = gitbookApiKey;
  config.gitbookDeploy.gitbookSpaceId = gitbookSpaceId;

  const configPath = path.join(process.cwd(), "lumen-docs", "config.json");
  await writeFile(configPath, JSON.stringify(config, null, 2));

  console.log("GitBook deployment has been enabled successfully.");
}
