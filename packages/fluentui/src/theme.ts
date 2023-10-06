import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";
import { Context, contextFuncs } from "refina";

export {
  createDarkTheme,
  createLightTheme,
  type BrandVariants,
  type Theme,
} from "@fluentui/tokens";

export let darkTheme: Theme = webDarkTheme;
export let lightTheme: Theme = webLightTheme;

const currentThemeSymbol = Symbol("currentTheme");

contextFuncs.useTheme = function (
  this: Context,
  ckey: string,
  dark?: Theme,
  light?: Theme,
) {
  this.$app.pushKey(ckey);
  const ikey = this.$app.ikey;

  const theme = light;

  const currentTheme = this.$permanentData[currentThemeSymbol];
  if (currentTheme && currentTheme.setBy !== ikey) {
    throw new Error("useTheme can only be called once.");
  }
  if (!currentTheme || currentTheme.theme !== theme) {
    for (const key in theme) {
      this.$app.root.node.style.setProperty(
        `--${String(key)}`,
        String(theme[key as keyof Theme]),
      );
    }

    this.$permanentData[currentThemeSymbol] = {
      setBy: ikey,
      theme,
    };
  }

  this.$app.popKey(ckey);
};

declare module "refina" {
  interface CustomContext<C> {
    useTheme: never extends C ? (dark?: Theme, light?: Theme) => void : never;
  }
}
