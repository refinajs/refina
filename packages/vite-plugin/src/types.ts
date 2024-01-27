import { FilterPattern } from "vite";

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
   * @default /\?(.*&)?raw/
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
  isRefina: (id: string, raw: string) => boolean;
}
