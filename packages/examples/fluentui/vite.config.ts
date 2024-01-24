import { defineConfig, Plugin } from "vite";
import Inspect from "vite-plugin-inspect";
import Refina from "vite-plugin-refina";

export default defineConfig({
  plugins: [Inspect(), Refina() as Plugin[]],
});
