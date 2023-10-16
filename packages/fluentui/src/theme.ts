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

const currentFThemeSymbol = Symbol("currentFTheme");

addCustomContextFunc(
  "provideFTheme",
  function (
    ckey: string,
    dark: Theme = webDarkTheme,
    light: Theme = webLightTheme,
  ) {
    const ikey = this.$app.pushKey(ckey);

    const theme = light;

    const currentTheme = this.$permanentData[currentFThemeSymbol];
    if (currentTheme && currentTheme.setBy !== ikey) {
      throw new Error("provideFTheme can only be called once.");
    }
    if (!currentTheme || currentTheme.theme !== theme) {
      for (const key in theme) {
        this.$app.root.node.style.setProperty(
          `--${String(key)}`,
          String(theme[key as keyof Theme]),
        );
      }

      this.$permanentData[currentFThemeSymbol] = {
        setBy: ikey,
        theme,
      };
    }

    this.$app.popKey(ckey);
  },
);

declare module "refina" {
  interface CustomContext<C> {
    provideFTheme: never extends C
      ? (dark?: Theme, light?: Theme) => void
      : never;
  }
}
