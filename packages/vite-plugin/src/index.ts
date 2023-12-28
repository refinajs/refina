import { RefinaTransformer } from "@refina/transformer";
import { Plugin } from "vite";
import Hmr from "./hmr";
import Transformer, { TransformerOptions } from "./transformer";
import { CommonOptions, Matcher, ResolvedCommonOptions } from "./types";

function uniformMatcher(matcher: Matcher): (id: string) => boolean {
  if (typeof matcher === "function") return matcher;
  if (typeof matcher === "string") return id => id === matcher;
  if (matcher instanceof RegExp) return id => matcher.test(id);
  if (Array.isArray(matcher)) {
    const matchers = matcher.map(uniformMatcher);
    return id => matchers.some(v => v(id));
  }
  throw new Error("Invalid matcher");
}

interface RefinaOptions extends CommonOptions, TransformerOptions {}

export default function Refina(options: RefinaOptions = {}): Plugin[] {
  const include = uniformMatcher(options.include ?? /\.[tj]s(\?|$)/);
  const exclude = uniformMatcher(options.exclude ?? (() => false));
  const ignore = uniformMatcher(
    options.ignore ?? /^(((^|\n)\s*\/\/[^\n]*)|\n)*\/\/\s*@refina-ignore/,
  );
  const resolvedOptions: RefinaOptions & ResolvedCommonOptions = {
    ...options,
    isRefina: (id: string, raw: string) =>
      include(id) && !exclude(id) && !ignore(raw),
  };

  return [Hmr(resolvedOptions), Transformer(resolvedOptions)];
}

export { RefinaTransformer };
