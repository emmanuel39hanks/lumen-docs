# Lumen Docs

Lumen Docs is a command-line tool that generates API documentation from OpenAPI specifications using OpenAI's GPT model.

## Usage

To use Lumen Docs, simply run the following command in your terminal:

```bash
npx lumen-docs
```

and you will be prompted to enter your OpenAI API key and specify the location of your OpenAPI spec file.

## Development

To run the project in development mode:

1. Clone the repository:
   ```
   git clone https://github.com/emmanuel39hanks/lumen-docs.git
   ```

2. Navigate to the project directory:
   ```
   cd lumen-docs
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the project:
   ```
   npm run build
   ```

## Usage

1. Run the tool:
   ```
   npm run dev
   ```

2. Follow the prompts to enter your OpenAI API key and specify the location of your OpenAPI spec file.

3. The generated documentation will be saved in the `lumen-gen` directory in the current working directory.

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