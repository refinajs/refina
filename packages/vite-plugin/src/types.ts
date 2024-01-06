export type Matcher = RegExp | string | ((id: string) => boolean) | Matcher[];

export function uniformMatcher(matcher: Matcher): (id: string) => boolean {
  if (typeof matcher === "function") return matcher;
  if (typeof matcher === "string") return id => id === matcher;
  if (matcher instanceof RegExp) return id => matcher.test(id);
  if (Array.isArray(matcher)) {
    const matchers = matcher.map(uniformMatcher);
    return id => matchers.some(v => v(id));
  }
  throw new Error("Invalid matcher");
}

export interface CommonOptions {
  /**
   * Include files for transformation.
   *
   * @default /\.[tj]s(\?|$)/
   */
  include?: Matcher;

  /**
   * Exclude files from transformation.
   *
   * @default /\?(.*&)?raw/
   */
  exclude?: Matcher;

  /**
   * Ignore files from transformation.
   *
   * @default /^(((^|\n)\s*\/\/[^\n]*)|\n)*\s*\/\/\s*@refina-ignore/
   */
  ignore?: Matcher;
}

export interface ResolvedCommonOptions {
  isRefina: (id: string, raw: string) => boolean;
}
