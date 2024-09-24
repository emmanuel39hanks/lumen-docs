import { loadConfig } from "../utils/load-config";
import { createSpinner } from "../utils/spinner";
import { handleError } from "../utils/error-handler";
import { deployToGitBook } from "../utils/gitbook-deploy";
import path from "path";

export async function deployDocumentation() {
  const spinner = createSpinner("Deploying documentation to GitBook...");
  spinner.start();

  try {
    const config = loadConfig();
    const { gitbookDeploy } = config;
    console.log(gitbookDeploy);
    if (!gitbookDeploy.enabled) {
      spinner.stop();
      console.log("GitBook deployment is not enabled. Run 'npx lumen-docs enable gitbook' to enable it.");
      return;
    }

    const { gitbookApiKey, gitbookSpaceId } = gitbookDeploy;

    if (!gitbookApiKey || !gitbookSpaceId) {
      spinner.stop();
      console.log("GitBook API key or Space ID is missing. Run 'npx lumen-docs enable gitbook' to configure them.");
      return;
    }

    const projectDir = process.cwd();
    const docsDir = path.join(projectDir, "lumen-docs", "docs");

    await deployToGitBook(docsDir, gitbookApiKey, gitbookSpaceId);

    spinner.success({ text: "Documentation deployed successfully to GitBook!" });
  } catch (error) {
    handleError(error, spinner);
  }
}
