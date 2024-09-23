# Lumen Docs

Illuminate Your API Documentation
Generate, manage, and deploy beautiful API docs from OpenAPI specs using AI magic!

## Lumen Docs CLI

To use Lumen Docs, simply run the following command in your terminal:

```bash
npx lumen-docs -h
```

### Usage

```plaintext
Usage: lumen-docs [options] [command]

Generate API documentation from OpenAPI spec

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  init              Initialize a new Lumen Docs project
  generate          Generate API documentation
  deploy            Deploy API documentation to GitBook
  config            Update Lumen Docs configuration
  enable <service>  Enable GitBook deployment
  help [command]    display help for command
```

### Commands

#### Initialize

Start your documentation journey with:

```bash
npx lumen-docs init
```

This command sets up a new Lumen Docs project in your current directory. It creates necessary configuration files and folder structure for your API documentation.

#### Generate

Convert your OpenAPI specs into readable Markdown docs with:

```bash
npx lumen-docs generate
```

#### Deploy

Share your docs using:

```bash
npx lumen-docs deploy 
```

One command, instant publication.

## Development

To run the project in development mode:

1. Clone the repository:
   ```bash
   git clone https://github.com/emmanuel39hanks/lumen-docs.git
   ```

2. Navigate to the project directory:
   ```bash
   cd lumen-docs
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Configuration

- The OpenAI API key can be set as an environment variable `OPENAI_API_KEY` in a `.env` file.
- The default location for the OpenAPI spec file is `./spec.json`, but you can specify a different location when prompted.

## Customization

You can customize the output of the generated documentation by modifying the `src/services/markdown.ts` file. The `generateMarkdownFiles` function determines the structure and content of the generated Markdown files.

## Error Handling

The tool includes error handling for common issues such as:
- Invalid API keys
- File not found errors
- Parsing errors for the OpenAPI spec

Error messages will be displayed in the console with helpful information for troubleshooting.

## Project Structure

```plaintext
lumen-gen/
├── src/
│ ├── cli/
│ │ ├── prompts.ts
│ │ ├── spinner.ts
│ │ └── welcome.ts
│ ├── config/
│ │ └── constants.ts
│ ├── services/
│ │ ├── markdown.ts
│ │ └── openai.ts
│ ├── types/
│ │ ├── index.ts
│ │ └── openapi.ts
│ ├── utils/
│ │ ├── error-handler.ts
│ │ ├── file.ts
│ │ └── openapi-parser.ts
│ └── index.ts
├── .env
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Powered by AI Magic

Lumen Docs leverages OpenAI's GPT model to generate intelligent and context-aware documentation.
```