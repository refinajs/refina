import MdUI from "../plugin";
import { AccentHue, PrimaryHue } from "./theme.const";

const currentThemeSymbol = Symbol("currentMDTheme");

MdUI.register(
  "provideMDTheme",
  function (ckey: string, primaryHue: PrimaryHue | undefined, accentHue: AccentHue | undefined): void {
    const ikey = this.$app.pushKey(ckey);

    const currentTheme = this.$permanentData[currentThemeSymbol];
    if (currentTheme && currentTheme.setBy !== ikey) {
      throw new Error("provideMDTheme can only be called once.");
    }

    if (primaryHue !== undefined) {
      this.$app._!.$rootCls(`mdui-theme-primary-${primaryHue as string}`);
    }

    if (accentHue !== undefined) {
      this.$app._!.$rootCls(`mdui-theme-accent-${accentHue as string}`);
    }

    this.$permanentData[currentThemeSymbol] = {
      setBy: ikey,
    };

    this.$app.popKey(ckey);
  },
);

declare module "refina" {
  interface CustomContext<C> {
    provideMDTheme: never extends C ? (primaryHue: PrimaryHue, accentHue: AccentHue) => void : never;
  }
}
