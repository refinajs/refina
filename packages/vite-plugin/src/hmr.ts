import { RefinaHmr, mainUrlSuffix } from "@refina/hmr";
import { FilterPattern, Plugin, createFilter } from "vite";
import { ResolvedCommonOptions } from "./types";

export interface HmrOptions {
  /**
   * Include files from HMR.
   *
   * @default /\.[tj]s(\?|$)/
   */
  includeHmr?: FilterPattern;

  /**
   * Exclude files from HMR.
   *
   * @default undefined
   */
  excludeHmr?: FilterPattern;
}

export const fullReload = {
  value: true,
};

export default function Hmr(
  options: HmrOptions & ResolvedCommonOptions,
): Plugin {
  const HmrFilter = createFilter(
    options.includeHmr ?? /\.[tj]s(\?|$)/,
    options.excludeHmr,
  );
  const shouldPerformHmr = (id: string, raw: string) =>
    options.isRefina(id, raw) && HmrFilter(id);

  const hmr = new RefinaHmr();

  return {
    name: "refina-hmr",
    apply: "serve",
    enforce: "pre",
    transform(raw, id) {
      if (!shouldPerformHmr(id, raw)) return null;
      if (!id.endsWith(mainUrlSuffix)) {
        // locals
        const descriptor = hmr.transform(id, raw);
        return descriptor?.locals;
      } else {
        // app main
        const entryId = id.slice(0, -mainUrlSuffix.length);
        const descriptor = hmr.transform(entryId, raw);
        return descriptor?.main;
      }
    },
    async handleHotUpdate(ctx) {
      const content = await ctx.read();
      if (!shouldPerformHmr(ctx.file, content)) return;
      if (hmr.update(ctx.file, content)) {
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
