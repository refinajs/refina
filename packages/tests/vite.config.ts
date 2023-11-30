import { defineConfig } from "vitest/config";
import Refina from "../vite-plugin/dist/plugin";

export default defineConfig({
  plugins: [Refina()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
