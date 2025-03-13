import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["html"],
      include: ["src"],
    },
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }, { browser: "webkit" }],
      headless: true,
    },
  },
});
