import { RefinaTransformer } from "@refina/transformer";
import type { Plugin, ResolvedConfig } from "vite";
import { ResolvedCommonOptions } from "./types";
import { fullReload } from "./hmr";

export interface TransformerOptions {
  /**
   * The transformer to use.
   *
   * @default new RefinaTransformer()
   */
  transformer?: RefinaTransformer;

  /**
   * Log the file key and the corresponding file path.
   *
   * @default config.command === "serve"
   */
  logFileMapping?: boolean;
}

export default function Transformer(
  options: TransformerOptions & ResolvedCommonOptions,
): Plugin {
  const transformer = options.transformer ?? new RefinaTransformer();

  let config: ResolvedConfig;
  return {
    name: "refina-transformer",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(raw, id) {
      if (!options.isRefina(id, raw)) return null;

      const result = transformer.transformFile(id, raw, fullReload.value);

      if (result === null) return null;

      const { code, map, key } = result;

      if (options.logFileMapping ?? config.command === "serve") {
        this.info(`"${key}"${" ".repeat(3 - key.length)}--> "${id}"`);
      }

      return {
        code,
        map,
      };
    },
  };
}
