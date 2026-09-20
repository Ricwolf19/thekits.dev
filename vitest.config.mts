import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node by default so the pure-logic suite stays fast. Component tests opt
    // into jsdom with a `@vitest-environment jsdom` docblock — Vitest 4 dropped
    // `environmentMatchGlobs`, and the docblock is the supported replacement.
    environment: "node",
  },
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
});
