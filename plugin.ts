import { Plugin } from "vite";
import MagicString from "magic-string";

export default function myExample() {
  const ctx = { id: 0 };
  return {
    name: "web-imgui-plugin",
    enforce: "pre",
    transform(code, id, options) {
      if (!id.endsWith(".r.ts")) {
        return null;
      }
      const s = new MagicString(code);
      s.replaceAll(
        /_\s*\.\s*([a-zA-Z0-9_]+)\s*\(\s*([\s\S]*?)\s*\)/g,
        (_, name, args) => {
          ctx.id++;
          return `_.$$("${name}", "${ctx.id
            .toString(36)
            .toUpperCase()}", ${args})`;
        }
      );
      s.replaceAll(
        /_\s*\.\s*([a-zA-Z0-9_]+)\s*\<([\s\S]+?)\>\s*\(\s*([\s\S]*?)\s*\)/g,
        (_, name, targs, args) => {
          ctx.id++;
          return `_.$$("${name}", "${ctx.id
            .toString(36)
            .toUpperCase()}", ${args})`;
        }
      );
      const map = s.generateMap({
        source: id,
        file: id + ".map",
        includeContent: true,
      });
      return {
        code: s.toString(),
        map,
      };
    },
  } satisfies Plugin;
}
