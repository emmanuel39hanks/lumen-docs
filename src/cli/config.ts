import prompts from "prompts";
import fs from "fs/promises";
import path from "path";

export async function updateConfiguration() {
  const configPath = path.join(process.cwd(), "lumen-docs", "lumen-docs.config.js");
  let config;

  try {
    config = require(configPath);
  } catch (error) {
    console.error(
      "Error reading configuration file. Have you initialized the project?"
    );
    return;
  }

  const { configKey } = await prompts([
    {
      type: "select",
      name: "configKey",
      message: "Which configuration key would you like to update?",
      choices: Object.keys(config).map((key) => ({ title: key, value: key })),
    },
  ]);

  const { newValue } = await prompts([
    {
      type: "text",
      name: "newValue",
      message: `Enter new value for ${configKey}:`,
      initial: JSON.stringify(config[configKey]),
    },
  ]);

  try {
    config[configKey] = JSON.parse(newValue);
  } catch (error) {
    config[configKey] = newValue;
  }

  const configContent = `module.exports = ${JSON.stringify(config, null, 2)};`;
  await fs.writeFile(configPath, configContent);
  console.log("Configuration updated successfully!");
}
