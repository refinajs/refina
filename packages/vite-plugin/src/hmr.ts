import { createHash } from "node:crypto";
import { Plugin } from "vite";
import { RefinaDescriptor, compile } from "./hmr-compiler";
import { mainUrlSuffix } from "./hmr-compiler/constants";
import { ResolvedCommonOptions } from "./types";

export interface HmrOptions {}

const cache = new Map<string, false | RefinaDescriptor>();

function getHash(text: string) {
  return createHash("sha256").update(text).digest("hex").substring(0, 8);
}

export default function Hmr(
  options: HmrOptions & ResolvedCommonOptions,
): Plugin {
  return {
    name: "refina-hmr",
    apply: "serve",
    enforce: "pre",
    // load(id) {
    //   if (!id.endsWith(mainUrlSuffix)) return null;
    //   const entryId = id.slice(0, -mainUrlSuffix.length);
    //   return readFileSync(entryId, "utf-8");
    // },
    transform(raw, id) {
      if (!options.isRefina(id, raw)) return null;

      if (!raw.includes("$app")) return null;

      if (!id.endsWith(mainUrlSuffix)) {
        // locals

        const cacheId = `${id}#${getHash(raw)}`;

        let descriptor = cache.get(cacheId)!;
        if (descriptor === undefined) {
          descriptor = compile(raw, id);
          cache.set(cacheId, descriptor);
        }

        if (descriptor === false) return null;

        return {
          code: descriptor.localsContent,
          map: descriptor.localsMap,
        };
      } else {
        // app main

        const entryId = id.slice(0, -mainUrlSuffix.length);
        const cacheId = `${entryId}#${getHash(raw)}`;

        let descriptor = cache.get(cacheId)!;
        if (descriptor === undefined) {
          descriptor = compile(raw, id);
          cache.set(cacheId, descriptor);
        }

        if (descriptor === false) return null;

        return {
          code: descriptor.mainContent,
          map: descriptor.mainMap,
        };
      }
    },
    handleHotUpdate(ctx) {
      // If `app.ts?refina-app-main` is updated,
      // `app.ts` should not be updated.
      return ctx.modules.filter(
        m => !ctx.modules.some(v => v.url === m.url + mainUrlSuffix),
      );
    },
  };
}
