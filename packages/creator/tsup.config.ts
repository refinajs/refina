import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["./src/index.ts"],
  format: ["cjs"],
  noExternal: ["chalk", "prompts"],
  target: "es2019",
  splitting: false,
};
