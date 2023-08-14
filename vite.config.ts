import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import plugin from "./plugin";

export default defineConfig({
  plugins: [Inspect(), plugin()],
});
