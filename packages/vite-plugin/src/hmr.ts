import { Plugin } from "vite";
import { transform, update, mainUrlSuffix } from "./hmr-compiler";
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

  return {
    name: "refina-hmr",
    apply: "serve",
    enforce: "pre",
    transform(raw, id) {
      if (!shouldPerformHmr(id, raw)) return null;
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
      const content = await ctx.read();
      if (!shouldPerformHmr(ctx.file, content)) return;
      const hmr = update(ctx.file, content);
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
