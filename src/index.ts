#!/usr/bin/env node

import { Command } from "commander";
import { displayWelcome } from "./cli/welcome";
import { initializeProject } from "./cli/init";
import { updateConfiguration } from "./cli/config";
import * as dotenv from "dotenv";
import { generateDocumentation } from "./cli/generate";
import { deployDocumentation } from "./cli/deploy";
import { enableGitBook } from "./cli/enable-gitbook";

dotenv.config();

const program = new Command();

program
  .name("lumen-docs")
  .description("Generate API documentation from OpenAPI spec")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize a new Lumen Docs project")
  .action(async () => {
    await displayWelcome();
    await initializeProject();
  });

program
  .command("generate")
  .description("Generate API documentation")
  .action(async () => {
    await generateDocumentation();
  });

program
  .command("deploy")
  .description("Deploy API documentation to GitBook")
  .action(async () => {
    await deployDocumentation();
  });

program
  .command("config")
  .description("Update Lumen Docs configuration")
  .action(async () => {
    await updateConfiguration();
  });

program
  .command("enable")
  .description("Enable GitBook deployment")
  .argument("<service>", "Service to enable (e.g., gitbook)")
  .action(async (service) => {
    if (service.toLowerCase() === "gitbook") {
      await enableGitBook();
    } else {
      console.error(`Unsupported service: ${service}`);
    }
  });

program.parse(process.argv);
