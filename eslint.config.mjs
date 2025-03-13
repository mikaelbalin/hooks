import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  globalIgnores(["dist/*"]),
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default defineConfig(config);
