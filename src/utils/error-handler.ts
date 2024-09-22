import { Spinner } from "nanospinner";

export function handleError(error: unknown, spinner: Spinner): void {
  console.error("Detailed error:", error);
  
  if (error instanceof Error) {
    spinner.error({ text: `Error: ${error.message}` });
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
  } else {
    spinner.error({ text: "An unknown error occurred" });
    console.error("Unknown error:", error);
  }
  process.exit(1);
}