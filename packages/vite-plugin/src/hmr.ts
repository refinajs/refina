import { Plugin } from "vite";
import { RefinaDescriptor, compile, update } from "./hmr-compiler";
import { mainUrlSuffix } from "./hmr-compiler/constants";
import { ResolvedCommonOptions } from "./types";

export interface HmrOptions {}

const cache = new Map<string, false | RefinaDescriptor>();

export default function Hmr(
  options: HmrOptions & ResolvedCommonOptions,
): Plugin {
  return {
    name: "refina-hmr",
    apply: "serve",
    enforce: "pre",
    transform(raw, id) {
      if (!options.isRefina(id, raw)) return null;

      if (!raw.includes("$app")) return null;

      if (!id.endsWith(mainUrlSuffix)) {
        // locals

        let descriptor = cache.get(id)!;
        if (descriptor === undefined) {
          descriptor = compile(raw, id);
          cache.set(id, descriptor);
        }

        if (descriptor === false) return null;

        return {
          code: descriptor.localsContent,
          map: descriptor.localsMap,
        };
      } else {
        // app main

        const entryId = id.slice(0, -mainUrlSuffix.length);

        let descriptor = cache.get(entryId)!;
        if (descriptor === undefined) {
          descriptor = compile(raw, entryId);
          cache.set(entryId, descriptor);
        }

        if (descriptor === false) return null;

        return {
          code: descriptor.mainContent,
          map: descriptor.mainMap,
        };
      }
    },
    async handleHotUpdate(ctx) {
      const descriptor = cache.get(ctx.file);
      if (!descriptor) return;
      const command = update(descriptor, await ctx.read(), ctx.file);
      switch (command) {
        case "full-reload":
          return;
        case "update-main":
          const localsMod = ctx.modules.find(m => m.id === ctx.file)!;
          const mainMod = ctx.modules.find(
            m => m.id === ctx.file + mainUrlSuffix,
          )!;

          for (const importer of localsMod.importers) {
            importer.importedModules.add(mainMod);
            mainMod.importers.add(importer);
          }

          return ctx.modules.filter(m => m.id !== ctx.file);
        case "no-update":
          return ctx.modules.filter(
            m => m.id !== ctx.file && m.id !== ctx.file + mainUrlSuffix,
          );
        default:
          const _exhaustiveCheck: never = command;
      }
    },
  };
}
