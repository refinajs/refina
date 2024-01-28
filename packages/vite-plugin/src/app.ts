import { Plugin } from "vite";
import Hmr, { HmrOptions } from "./hmr";
import { CommonOptions, ResolvedCommonOptions, getFilter } from "./options";
import Transformer, { TransformerOptions } from "./transformer";

interface RefinaOptions extends CommonOptions, TransformerOptions, HmrOptions {
  /**
   * Enable HMR.
   *
   * @default true
   */
  hmr?: boolean;
}

export function Refina(options: RefinaOptions = {}): Plugin[] {
  const resolvedOptions: RefinaOptions & ResolvedCommonOptions = {
    ...options,
    filter: getFilter(options),
  };

  const hmrEnabled = options.hmr ?? true;

  return hmrEnabled
    ? [Hmr(resolvedOptions), Transformer(resolvedOptions)]
    : [Transformer(resolvedOptions)];
}
