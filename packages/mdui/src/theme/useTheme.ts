import { $contextFunc, _ } from "refina";

export type MdUITheme = "light" | "dark" | "auto";

export const useMdTheme = $contextFunc(
  () =>
    (theme: MdUITheme = "auto"): void => {
      if (_.$updateContext) {
        _.$body.addCls(`mdui-theme-${theme}`);
      }
    },
);
