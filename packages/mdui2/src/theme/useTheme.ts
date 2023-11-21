import MdUI2 from "../plugin";

export type MdUITheme = "light" | "dark" | "auto";

MdUI2.registerFunc("useMdTheme", function (_ckey, theme: MdUITheme = "auto") {
  this.$rootCls(`mdui-theme-${theme}`);
});

declare module "refina" {
  interface ContextFuncs<C> {
    useMdTheme: never extends C["enabled"]
      ? (theme?: MdUITheme) => void
      : never;
  }
}
