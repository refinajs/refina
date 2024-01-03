import { RefinaHmr, mainUrlSuffix } from "@refina/hmr";
import { Plugin } from "vite";
import { Matcher, ResolvedCommonOptions, uniformMatcher } from "./types";

export interface HmrOptions {
  /**
   * Exclude files from HMR.
   *
   * @default []
   */
  excludeHmr?: Matcher;
}

export const fullReload = {
  value: true,
};

export default function Hmr(
  options: HmrOptions & ResolvedCommonOptions,
): Plugin {
  const exclude = uniformMatcher(options.excludeHmr ?? (() => false));
  const shouldPerformHmr = (id: string, raw: string) =>
    options.isRefina(id, raw) && !exclude(id);

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
