import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Refina, { RefinaTransformer } from "vite-plugin-refina";

const libs = ["basic-components", "core", "mdui", "transformer"];

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
        libs.map(lib => [lib, resolve("..", lib, "src/index.ts")]),
      ),
      formats: ["es"],
    },
    minify: "terser",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
