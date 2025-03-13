#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import chalk from "chalk";

import { generateHookFiles } from "./file-generator.mjs";
import { updateReadme } from "./readme-updater.mjs";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main function to create hooks
 */
const createHook = async () => {
  console.log(chalk.bold.blue("\n🪝 React Hook Generator"));

  const { hookName } = await prompts({
    type: "text",
    name: "hookName",
    message: "Enter hook name:",
    validate: (value) =>
      value.startsWith("use") ? true : 'Hook name must start with "use"',
  });

  // Exit if user cancelled
  if (!hookName) {
    console.log(chalk.yellow("\nHook creation cancelled"));
    return;
  }

  const { description } = await prompts({
    type: "text",
    name: "description",
    message: "Enter a brief description for the hook:",
  });

  const hookTitle = hookName.charAt(0).toUpperCase() + hookName.slice(1);
  const hookDir = path.join(__dirname, "..", "src", hookName);
  const readmePath = path.join(__dirname, "..", "README.md");

  try {
    // Generate all hook files
    await generateHookFiles(hookDir, hookName, hookTitle, description);

    // Update README.md
    await updateReadme(readmePath, hookName, hookTitle);

    console.log(
      chalk.bold.green(`\n🎉 Successfully created ${chalk.cyan(hookName)}!`)
    );
    console.log(chalk.dim(`\nLocation: ${hookDir}`));
  } catch (err) {
    console.error(chalk.bold.red("\n❌ Error creating hook:"), err);
    process.exit(1);
  }
};

createHook().catch((err) => {
  console.error(chalk.bold.red("\n❌ Unexpected error:"), err);
  process.exit(1);
});
