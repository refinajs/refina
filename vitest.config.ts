import { defineConfig } from "vitest/config";
import Refina from "./packages/vite-plugin";

export default defineConfig({
  plugins: [Refina()],
  test: {
    include: ["packages/tests/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
    },
  },
});
