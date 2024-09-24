import path from "path";
import fs from "fs";

function loadEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: Record<string, string> = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    return envVars;
  }
  return {};
}

export function loadConfig() {
  let dotenv;
  try {
    dotenv = require('dotenv');
    dotenv.config();
  } catch (error) {
    const envVars = loadEnvFile();
    Object.assign(process.env, envVars);
  }

  const configPath = path.join(
    process.cwd(),
    "lumen-docs",
    "lumen-docs.config.js"
  );

  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const config = require(configPath);

  return config;
}