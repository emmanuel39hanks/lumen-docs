import path from "path";
import fs from "fs";

export function loadConfig() {
  const configPath = path.join(process.cwd(), "lumen-docs", "lumen-docs.config.js");
  
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const config = require(configPath);
  return config;
}