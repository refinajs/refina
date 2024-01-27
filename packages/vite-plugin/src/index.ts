import { RefinaTransformer } from "@refina/transformer";
import { Plugin, createFilter } from "vite";
import Hmr, { HmrOptions } from "./hmr";
import Transformer, { TransformerOptions } from "./transformer";
import { CommonOptions, ResolvedCommonOptions } from "./types";

interface RefinaOptions extends CommonOptions, TransformerOptions, HmrOptions {
  /**
   * Enable HMR.
   *
   * @default true
   */
  hmr?: boolean;
}

export default function Refina(options: RefinaOptions = {}): Plugin[] {
  const idFilter = createFilter(
    options.include ?? /\.[tj]s(\?|$)/,
    options.exclude ?? /\?(.*&)?raw/,
  );
  const rawFilter = createFilter(
    /./,
    options.ignore ?? /^(((^|\n)\s*\/\/[^\n]*)|\n)*\s*\/\/\s*@refina-ignore/,
  );
  const resolvedOptions: RefinaOptions & ResolvedCommonOptions = {
    ...options,
    isRefina: (id: string, raw: string) => idFilter(id) && rawFilter(raw),
  };

  const hmrEnabled = options.hmr ?? true;

  return hmrEnabled
    ? [Hmr(resolvedOptions), Transformer(resolvedOptions)]
    : [Transformer(resolvedOptions)];
}

export { RefinaTransformer };
