import fs from "fs";
import chalk from "chalk";
import ora from "ora";

/**
 * Updates the README.md file with information about the new hook
 *
 * @param {string} readmePath - Path to the README.md file
 * @param {string} hookName - Name of the hook
 * @param {string} hookTitle - Title-cased hook name
 * @returns {Promise<void>}
 */
export async function updateReadme(readmePath, hookName, hookTitle) {
  const spinner = ora(
    `Updating README.md with ${chalk.cyan(hookName)}`
  ).start();

  try {
    const readme = fs.readFileSync(readmePath, "utf8");

    // Use HTML comment markers to find where to insert the hook
    const hooksStartMarker = "<!-- HOOKS_START -->";
    const hooksEndMarker = "<!-- HOOKS_END -->";

    const hookEntry = `
### ${hookTitle}

A React hook that ${hookName.replace("use", "").toLowerCase()}s.

- [Source](./src/${hookName}/${hookName}.ts)
- [Documentation & Examples](https://kaelui-hooks.netlify.app/?path=/docs/${hookName.toLowerCase()})
`;

    // Check if the markers exist
    if (
      !readme.includes(hooksStartMarker) ||
      !readme.includes(hooksEndMarker)
    ) {
      spinner.fail(`Could not find hook section markers in README.md`);
      return;
    }

    // Split the README into sections using the markers
    const [beforeHooksSection, rest] = readme.split(hooksStartMarker);
    const [currentHooksContent, afterHooksSection] = rest.split(hooksEndMarker);

    // Add the new hook entry and reconstruct the README
    const updatedReadme = `${beforeHooksSection}${hooksStartMarker}${currentHooksContent}${hookEntry}${hooksEndMarker}${afterHooksSection}`;

    fs.writeFileSync(readmePath, updatedReadme);
    spinner.succeed(`Updated README.md with ${chalk.cyan(hookName)}`);
  } catch (error) {
    spinner.fail(
      `Failed to update README: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
