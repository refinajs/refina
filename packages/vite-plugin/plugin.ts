import { RefinaTransformer } from "@refina/transformer";
import type { Plugin } from "vite";

export default function refina(
  transformer: RefinaTransformer = new RefinaTransformer(),
) {
  return {
    name: "refina-plugin",
    enforce: "pre",
    transform(raw, id) {
      if (!transformer.shouldTransform(id)) {
        return null;
      }
      const { code, map, fileKey } = transformer.transformFile(id, raw);

      console.log(`"${fileKey}"${" ".repeat(3 - fileKey.length)}--> "${id}"`);

      return {
        code,
        map,
      };
    },
  } satisfies Plugin;
}

export { RefinaTransformer };
