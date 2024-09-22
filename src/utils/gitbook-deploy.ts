import axios from "axios";
import path from "path";
import archiver from "archiver";
import fs from "fs";
import * as fsPromises from "fs/promises";

async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

async function deployToGitBookAPI(
  zipPath: string,
  spaceId: string,
  apiKey: string
): Promise<void> {
  try {
    const response = await axios.post(
      `https://api.gitbook.com/v1/spaces/${spaceId}/content/import`,
      {
        url: `file://${zipPath}`,
        source: "zip",
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to deploy to GitBook: ${response.statusText}`);
    }

    console.log(zipPath);

    console.log("Deployment successful:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to deploy to GitBook: ${error.message}`);
    } else {
      throw error;
    }
  }
}

export async function deployToGitBook(
  outputDir: string,
  gitbookApiKey: string,
  gitbookSpaceId: string
): Promise<void> {
  const projectDir = process.cwd();
  const zipPath = path.join(projectDir, "lumen-docs", "docs.zip");

  await zipDirectory(outputDir, zipPath);
  await deployToGitBookAPI(zipPath, gitbookSpaceId, gitbookApiKey);
  await fsPromises.unlink(zipPath);

  console.log("Successfully deployed to GitBook");
}
