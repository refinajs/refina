import { RefinaTransformer } from "@refina/transformer";
import type { Plugin, ResolvedConfig } from "vite";

type Matcher = RegExp | string | ((id: string) => boolean) | Matcher[];

export interface RefinaOptions {
  /**
   * Include files for transformation.
   *
   * @default /\.[tj]s$/
   */
  include?: Matcher;

  /**
   * Exclude files from transformation.
   *
   * @default []
   */
  exclude?: Matcher;

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
  log?: boolean;
}

function uniformMatcher(matcher: Matcher): (id: string) => boolean {
  if (typeof matcher === "function") return matcher;
  if (typeof matcher === "string") return id => id === matcher;
  if (matcher instanceof RegExp) return id => matcher.test(id);
  if (Array.isArray(matcher)) {
    const matchers = matcher.map(uniformMatcher);
    return id => matchers.some(v => v(id));
  }
  throw new Error("Invalid matcher");
}

export default function Refina(options: RefinaOptions = {}) {
  const include = uniformMatcher(options.include ?? [/\.[tj]s$/]);
  const exclude = uniformMatcher(options.exclude ?? []);
  const transformer = options.transformer ?? new RefinaTransformer();

  let config: ResolvedConfig;
  return {
    name: "refina-plugin",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(raw, id) {
      if (!include(id) || exclude(id)) return null;

      const result = transformer.transformFile(id, raw);

      if (result === null) return null;

      const { code, map, fileKey } = result;

      if (options.log ?? config.command === "serve") {
        config.logger.info(
          `"${fileKey}"${" ".repeat(3 - fileKey.length)}--> "${id}"`,
        );
      }

      return {
        code,
        map,
      };
    },
  } as Plugin;
}

export { RefinaTransformer };
