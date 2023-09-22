import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import refina from "./plugin";

export default defineConfig({
  plugins: [Inspect(), refina()],
});
