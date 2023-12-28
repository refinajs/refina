export type Matcher = RegExp | string | ((id: string) => boolean) | Matcher[];

export interface CommonOptions {
  /**
   * Include files for transformation.
   *
   * @default /\.[tj]s$/
   */
  include?: Matcher;

  /**
   * Exclude files from transformation.
   *
   * @default []
   */
  exclude?: Matcher;

  /**
   * Ignore files from transformation.
   *
   * @default /^(((^|\n)\s*\/\/[^\n]*)|\n)*\/\/\s*@refina-ignore/
   */
  ignore?: Matcher;
}

export interface ResolvedCommonOptions {
  isRefina: (id: string, raw: string) => boolean;
}
