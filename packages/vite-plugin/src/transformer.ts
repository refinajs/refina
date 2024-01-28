import { RefinaTransformer } from "@refina/transformer";
import {
  createFilter,
  type FilterPattern,
  type Plugin,
  type ResolvedConfig,
} from "vite";
import { ResolvedCommonOptions } from "./options";
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

  /**
   * Include files to deps.
   *
   * @default /node_modules/
   */
  includeDeps?: FilterPattern;

  /**
   * Exclude files from deps.
   *
   * @default /\?(.*&)?raw/,
   */
  excludeDeps?: FilterPattern;
}

export default function Transformer(
  options: TransformerOptions & ResolvedCommonOptions,
): Plugin {
  const transformer = options.transformer ?? new RefinaTransformer();
  const depsFilter = createFilter(
    options.includeDeps ?? /node_modules/,
    options.excludeDeps ?? /\?(.*&)?raw/,
  );

  let config: ResolvedConfig;
  return {
    name: "refina:transformer",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      if (config.mode === "production") {
        let i = 0;
        transformer.toCkey = () => toBase62(i++);
      }
    },
    transform(raw, id) {
      if (options.filter(id, raw)) {
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
      } else if (depsFilter(id)) {
        const result = transformer.transformDep(id, raw);

        if (result === null) return null;

        const { code, map, key } = result;

        if (options.logFileMapping ?? config.command === "serve") {
          this.info(`"${key}"${" ".repeat(3 - key.length)}--> "${id}"`);
        }

        return {
          code,
          map,
        };
      }
    },
  };
}

const base62Table =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" as const;

function toBase62(n: number) {
  let s = "";
  let i = n;
  do {
    s = base62Table[i % 62] + s;
    i = Math.floor(i / 62);
  } while (i);
  return s;
}
