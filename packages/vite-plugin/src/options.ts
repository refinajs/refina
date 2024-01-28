import { FilterPattern, createFilter } from "vite";

export interface CommonOptions {
  /**
   * Include files for transformation.
   *
   * @default /\.[tj]s(\?|$)/
   */
  include?: FilterPattern;

  /**
   * Exclude files from transformation.
   *
   * @default [/\?(.*&)?raw/, /node_modules/]
   */
  exclude?: FilterPattern;

  /**
   * Ignore files from transformation.
   *
   * @default /^(((^|\n)\s*\/\/[^\n]*)|\n)*\s*\/\/\s*@refina-ignore/
   */
  ignore?: FilterPattern;
}

export interface ResolvedCommonOptions {
  filter: (id: string, raw: string) => boolean;
}

export function getFilter(options: CommonOptions) {
  const idFilter = createFilter(
    options.include ?? /\.[tj]s(\?|$)/,
    options.exclude ?? [/\?(.*&)?raw/, /node_modules/],
  );
  const rawFilter = createFilter(
    /./,
    options.ignore ?? /^(((^|\n)\s*\/\/[^\n]*)|\n)*\s*\/\/\s*@refina-ignore/,
  );
  return (id: string, raw: string) => idFilter(id) && rawFilter(raw);
}
