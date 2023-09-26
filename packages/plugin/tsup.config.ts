import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["./plugin.ts"],
  format: ["cjs", "esm"],
  target: "es2019",
  sourcemap: true,
  dts: true,
};
