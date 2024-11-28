import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global variables like `describe` and `test`
    // setupFiles: "./test/setup.ts", // Optional setup file for Puppeteer
    testTimeout: 60_000, // Extend timeout for Puppeteer tests
  },
});
