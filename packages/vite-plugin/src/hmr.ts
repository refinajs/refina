import { Plugin } from "vite";
import { transform, update, mainUrlSuffix } from "./hmr-compiler";
import { ResolvedCommonOptions } from "./types";

export interface HmrOptions {}

export const fullReload = {
  value: true,
};

export default function Hmr(
  options: HmrOptions & ResolvedCommonOptions,
): Plugin {
  return {
    name: "refina-hmr",
    apply: "serve",
    enforce: "pre",
    transform(raw, id) {
      if (!options.isRefina(id, raw)) return null;
      if (!id.endsWith(mainUrlSuffix)) {
        // locals
        const descriptor = transform(id, raw);
        return descriptor?.locals;
      } else {
        // app main
        const entryId = id.slice(0, -mainUrlSuffix.length);
        const descriptor = transform(entryId, raw);
        return descriptor?.main;
      }
    },
    async handleHotUpdate(ctx) {
      const hmr = update(ctx.file, await ctx.read());
      if (hmr) {
        const localsMod = ctx.modules.find(m => m.id === ctx.file)!;
        const mainMod = ctx.modules.find(
          m => m.id === ctx.file + mainUrlSuffix,
        )!;

        for (const importer of localsMod.importers) {
          importer.importedModules.add(mainMod);
          mainMod.importers.add(importer);
        }

        fullReload.value = false;

        return ctx.modules.filter(m => m.id !== ctx.file);
      } else {
        fullReload.value = true;
      }
    },
  };
}
