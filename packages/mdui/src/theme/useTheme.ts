import MdUI from "../plugin";

export type MdUITheme = "light" | "dark" | "auto";

MdUI.registerFunc("useMdTheme", function (_ckey, theme: MdUITheme = "auto") {
  if (this.$updateContext) {
    this.$body.addCls(`mdui-theme-${theme}`);
  }
});

declare module "refina" {
  interface ContextFuncs<C> {
    useMdTheme: never extends C["enabled"]
      ? (theme?: MdUITheme) => void
      : never;
  }
}
