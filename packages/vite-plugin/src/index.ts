import { RefinaTransformer } from "@refina/transformer";
import { Plugin } from "vite";
import Hmr, { HmrOptions } from "./hmr";
import Transformer, { TransformerOptions } from "./transformer";
import { CommonOptions, ResolvedCommonOptions, uniformMatcher } from "./types";

interface RefinaOptions extends CommonOptions, TransformerOptions, HmrOptions {
  /**
   * Enable HMR.
   *
   * @default true
   */
  hmr?: boolean;
}

export default function Refina(options: RefinaOptions = {}): Plugin[] {
  const include = uniformMatcher(options.include ?? /\.[tj]s(\?|$)/);
  const exclude = uniformMatcher(options.exclude ?? /\?(.*&)?raw/);
  const ignore = uniformMatcher(
    options.ignore ?? /^(((^|\n)\s*\/\/[^\n]*)|\n)*\/\/\s*@refina-ignore/,
  );
  const resolvedOptions: RefinaOptions & ResolvedCommonOptions = {
    ...options,
    isRefina: (id: string, raw: string) =>
      include(id) && !exclude(id) && !ignore(raw),
  };

  const hmrEnabled = options.hmr ?? true;

  return hmrEnabled
    ? [Hmr(resolvedOptions), Transformer(resolvedOptions)]
    : [Transformer(resolvedOptions)];
}

export { RefinaTransformer };
