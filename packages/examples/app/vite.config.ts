import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import Refina from "vite-plugin-refina";

export default defineConfig({
  plugins: [Inspect(), Refina()],
});
