import { RefinaTransformer } from "@refina/transformer";
import type { Plugin, ResolvedConfig } from "vite";

export default function refina(
  transformer: RefinaTransformer = new RefinaTransformer(),
) {
  let config: ResolvedConfig;
  return {
    name: "refina-plugin",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(raw, id) {
      if (!transformer.shouldTransform(id)) {
        return null;
      }
      const { code, map, fileKey } = transformer.transformFile(id, raw);

      config.logger.info(
        `"${fileKey}"${" ".repeat(3 - fileKey.length)}--> "${id}"`,
      );

      return {
        code,
        map,
      };
    },
  } satisfies Plugin;
}

export { RefinaTransformer };
