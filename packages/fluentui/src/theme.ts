import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";
import { addCustomContextFunc } from "refina";

export {
  createDarkTheme,
  createLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  teamsLightTheme,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/tokens";
export type { BrandVariants, Theme } from "@fluentui/tokens";

export let darkTheme: Theme = webDarkTheme;
export let lightTheme: Theme = webLightTheme;

const currentThemeSymbol = Symbol("currentTheme");

addCustomContextFunc(
  "useTheme",
  function (ckey: string, dark?: Theme, light?: Theme) {
    const ikey = this.$app.pushKey(ckey);

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
  },
);

declare module "refina" {
  interface CustomContext<C> {
    useTheme: never extends C ? (dark?: Theme, light?: Theme) => void : never;
  }
}
