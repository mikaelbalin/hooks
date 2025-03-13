#!/usr/bin/env node

import { execSync } from "child_process";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";

// Get current version from package.json
const packageJson = JSON.parse(
  execSync("cat package.json", { encoding: "utf-8" })
);
const currentVersion = packageJson.version;

async function main() {
  console.log(chalk.blue(`Current version: ${currentVersion}`));

  // Ensure git is clean before proceeding
  if (!(await ensureCleanGitStatus())) {
    return;
  }

  // Get version from user
  const version = await selectVersionForRelease();
  if (!version) {
    return;
  }

  // Create the release
  await createRelease(version);
}

/**
 * Checks git status and offers to commit changes if needed
 * @returns {Promise<boolean>} true if git is clean or changes were committed, false if operation was aborted
 */
async function ensureCleanGitStatus() {
  const isGitClean = checkGitStatus();
  if (isGitClean) {
    return true;
  }

  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "Git working directory is not clean. What would you like to do?",
    choices: [
      { title: "Commit all changes", value: "commit" },
      { title: "Abort release", value: "abort" },
    ],
  });

  if (action === "abort" || !action) {
    console.log(chalk.yellow("Release aborted"));
    return false;
  }

  return await commitChanges();
}

/**
 * Prompts for commit message and commits all changes
 * @returns {Promise<boolean>} true if successful, false if failed
 */
async function commitChanges() {
  const { commitMessage } = await prompts({
    type: "text",
    name: "commitMessage",
    message: "Enter commit message:",
    initial: "chore: prepare for release",
  });

  if (!commitMessage) {
    console.log(chalk.yellow("Release aborted"));
    return false;
  }

  const stageSpinner = ora("Staging and committing changes...").start();
  try {
    execSync("git add .");
    execSync(`git commit -m "${commitMessage}"`);
    stageSpinner.succeed(chalk.green("Changes committed successfully"));
    return true;
  } catch (error) {
    stageSpinner.fail(chalk.red("Failed to commit changes"));
    console.error(String(error));
    return false;
  }
}

/**
 * Prompts the user to select a version for release
 * @returns {Promise<string|null>} selected version or null if canceled
 */
async function selectVersionForRelease() {
  const response = await prompts({
    type: "select",
    name: "releaseType",
    message: "Select the type of release:",
    choices: [
      { title: `Patch (${getNextVersion("patch")})`, value: "patch" },
      { title: `Minor (${getNextVersion("minor")})`, value: "minor" },
      { title: `Major (${getNextVersion("major")})`, value: "major" },
      { title: "Custom", value: "custom" },
    ],
  });

  if (!response.releaseType) {
    console.log(chalk.yellow("Release cancelled"));
    return null;
  }

  if (response.releaseType !== "custom") {
    return response.releaseType;
  }

  // Handle custom version input
  const customResponse = await prompts({
    type: "text",
    name: "version",
    message: "Enter the version number:",
    validate: (value) =>
      isValidVersion(value) ? true : "Please enter a valid semver version",
  });

  if (!customResponse.version) {
    console.log(chalk.yellow("Release cancelled"));
    return null;
  }

  return customResponse.version;
}

/**
 * Creates a release with the specified version
 * @param {string} version The version to release
 */
async function createRelease(version) {
  const spinner = ora("Creating release...").start();

  try {
    execSync(`pnpm version ${version} --message "chore: release v%s"`, {
      stdio: "inherit",
    });
    spinner.succeed(
      chalk.green(`Successfully released version ${getNextVersion(version)}`)
    );
    return true;
  } catch (error) {
    spinner.fail(chalk.red("Release failed"));
    if (error instanceof Error) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Check if git working directory is clean
 * @returns {boolean} true if clean, false if there are uncommitted changes
 */
function checkGitStatus() {
  try {
    const status = execSync("git status --porcelain").toString();
    return status.trim() === "";
  } catch (error) {
    console.error(chalk.red("Failed to check git status"));
    console.error(error);
    return false;
  }
}

/**
 * @param {string} releaseType
 */
function getNextVersion(releaseType) {
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  switch (releaseType) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
    default:
      return releaseType;
  }
}

/**
 * @param {string} version
 */
function isValidVersion(version) {
  const semVerRegex = /^\d+\.\d+\.\d+$/;
  return semVerRegex.test(version);
}

main().catch((error) => {
  console.error(chalk.red("An error occurred:"));
  console.error(error);
  process.exit(1);
});
