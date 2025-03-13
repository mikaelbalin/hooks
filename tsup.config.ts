import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/**/use*.ts",
    "!src/**/*.test.*",
    "!src/**/*.stories.*",
    "!src/**/*.mdx",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
});
