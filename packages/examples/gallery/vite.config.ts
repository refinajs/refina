import { Plugin, defineConfig } from "vite";
import Refina from "vite-plugin-refina";
import MsClarity from "vite-plugin-ms-clarity";

export default defineConfig({
  plugins: [Refina() as Plugin[], MsClarity("k9vjx99oj1")],
});
