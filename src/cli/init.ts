import fs from "fs/promises";
import path from "path";
import prompts from "prompts";

export async function initializeProject() {
  const projectDir = process.cwd();
  const lumenDocsDir = path.join(projectDir, "lumen-docs");

  try {
    await fs.access(lumenDocsDir);
    console.log(
      "Lumen Docs project already initialized. Run 'npx lumen-docs generate' to generate documentation."
    );
    return;
  } catch (error) {
    // if the lumen-docs directory does not exist, proceed with init
  }

  await fs.mkdir(lumenDocsDir, { recursive: true });
  await fs.mkdir(path.join(lumenDocsDir, "versions", "specs"), {
    recursive: true,
  });
  await fs.mkdir(path.join(lumenDocsDir, "versions", "docs"), {
    recursive: true,
  });

  const { openaiApiKey, gitbookDeploy, gitbookApiKey, gitbookSpaceId } =
    await prompts([
      {
        type: "text",
        name: "openaiApiKey",
        message: "Enter your OpenAI API key:",
        validate: (input) => input.length > 0 || "API key is required",
      },
      {
        type: "select",
        name: "gitbookDeploy",
        message: "How would you like to deploy to GitBook?",
        choices: [
          { title: "Use 'lumen-docs deploy' command", value: "lumen-docs" },
          { title: "Manual git sync setup", value: "manual" },
        ],
      },
      {
        type: (prev) => (prev === "lumen-docs" ? "text" : null),
        name: "gitbookApiKey",
        message: "Enter your GitBook API key:",
        validate: (input) =>
          input.length > 0 ||
          "GitBook API key is required for automatic deployment",
      },
      {
        type: (prev, values) =>
          values.gitbookDeploy === "lumen-docs" ? "text" : null,
        name: "gitbookSpaceId",
        message: "Enter your GitBook Space ID:",
        validate: (input) =>
          input.length > 0 ||
          "GitBook Space ID is required for automatic deployment",
      },
    ]);

  const configContent = `
module.exports = {
  outputDir: 'docs/',
  gitbookDeploy: {
    enabled: ${gitbookDeploy === "lumen-docs"},
    gitbookApiKey: process.env.LUMEN_DOCS_GITBOOK_API_KEY,
    gitbookSpaceId: process.env.LUMEN_DOCS_GITBOOK_SPACE_ID,
  },
  openai: {
    apiKey: process.env.LUMEN_DOCS_OPENAI_API_KEY,
    model: 'gpt-4',
    tone: 'formal',
    temperature: 0.2,
  },
  versions: {
    enabled: true,
    keepVersions: 5,
  },
};
`;

  await fs.writeFile(
    path.join(lumenDocsDir, "lumen-docs.config.js"),
    configContent
  );

  const envContent = `
LUMEN_DOCS_OPENAI_API_KEY=${openaiApiKey}
LUMEN_DOCS_GITBOOK_API_KEY=${gitbookApiKey || ""}
LUMEN_DOCS_GITBOOK_SPACE_ID=${gitbookSpaceId || ""}
`;

  await fs.appendFile(path.join(projectDir, ".env"), envContent);

  console.log("Lumen Docs project initialized successfully!");
  if (gitbookDeploy === "lumen-docs") {
    console.log("You can use 'lumen-docs deploy' to deploy to GitBook.");
  } else {
    console.log("Please set up manual git sync for GitBook deployment.");
  }
}
