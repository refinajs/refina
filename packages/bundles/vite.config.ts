import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Refina, { RefinaTransformer } from "vite-plugin-refina";

const libs = {
  core: "core/dist/index.js",
  "basic-components": "basic-components/dist/index.js",
  mdui: "mdui/dist/index.js",
  fluentui: "fluentui/dist/index.js",
  transformer: "transformer/src/index.ts",
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const transformer = new RefinaTransformer();
transformer.ckeyPrefix = "b_"; // means "bundle"

export default defineConfig({
  plugins: [
    Refina({
      transformer,
    }) as any,
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: Object.fromEntries(
        Object.entries(libs).map(([k, v]) => [k, resolve(__dirname, "..", v)]),
      ),
      formats: ["es"],
    },
    minify: "terser",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
