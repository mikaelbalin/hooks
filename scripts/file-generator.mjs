import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import {
  getHookTemplate,
  getIndexTemplate,
  getMdxTemplate,
  getStoryTemplate,
  getTestTemplate,
} from "./templates.mjs";

/**
 * Creates a directory if it doesn't exist
 *
 * @param {string} dirPath - Path to directory
 */
export function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generates all files for a hook with interactive feedback
 *
 * @param {string} hookDir - Directory where hook files will be created
 * @param {string} hookName - Name of the hook
 * @param {string} hookTitle - Title-cased hook name
 * @param {string} description - Description of the hook
 * @returns {Promise<void>}
 */
export async function generateHookFiles(
  hookDir,
  hookName,
  hookTitle,
  description
) {
  const mainSpinner = ora(
    `Generating ${chalk.cyan(hookName)} files...`
  ).start();

  try {
    // Create hook directory
    createDirIfNotExists(hookDir);

    // Create index file
    mainSpinner.text = `Creating index file for ${chalk.cyan(hookName)}...`;
    fs.writeFileSync(
      path.join(hookDir, "index.ts"),
      getIndexTemplate(hookName)
    );
    await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay for visual effect

    // Create hook file
    const hookFileName = `${hookName}.ts`;
    mainSpinner.text = `Creating hook file ${chalk.cyan(hookFileName)}...`;
    fs.writeFileSync(
      path.join(hookDir, hookFileName),
      getHookTemplate(hookName, description)
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create test file
    const testFileName = `${hookName}.test.ts`;
    mainSpinner.text = `Creating test file ${chalk.cyan(testFileName)}...`;
    fs.writeFileSync(
      path.join(hookDir, testFileName),
      getTestTemplate(hookName)
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create story file
    const storyFileName = `${hookName}.stories.tsx`;
    mainSpinner.text = `Creating story file ${chalk.cyan(storyFileName)}...`;
    fs.writeFileSync(
      path.join(hookDir, storyFileName),
      getStoryTemplate(hookName, hookTitle)
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create MDX file
    const mdxFileName = `${hookName}.mdx`;
    mainSpinner.text = `Creating docs file ${chalk.cyan(mdxFileName)}...`;
    fs.writeFileSync(
      path.join(hookDir, mdxFileName),
      getMdxTemplate(hookName, description)
    );

    mainSpinner.succeed(`Created all files for ${chalk.cyan(hookName)}`);
  } catch (error) {
    mainSpinner.fail(
      `Failed to generate files: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
