import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  target: "es2019",
  noExternal: ["@refina/transformer", "@refina/hmr"],
  sourcemap: true,
  dts: true,
  splitting: false,
};
