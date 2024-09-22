const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function displayWelcome(): Promise<void> {
  console.clear();
  console.log(`
╔════════════════════════════════════════════╗
║           Welcome to Lumen Docs!            ║
╚════════════════════════════════════════════╝

Lumen Docs is a tool to generate API documentation from your OpenAPI spec.

HOW TO USE
──────────
Follow these steps to get started:

1. Provide your OpenAI API key (if not set)
2. Specify the location of your OpenAPI spec file
3. Sit back and watch as Lumen Docs generates your documentation!

Let's begin!
`);

  await sleep(1000);
}
