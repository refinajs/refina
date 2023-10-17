import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";
import FIcons from "@refina/fluentui-icons";
import { Plugin } from "refina";

const currentFThemeSymbol = Symbol("currentFTheme");

const FluentUI = new Plugin(
  "fluentui",
  (app, dark: Theme = webDarkTheme, light: Theme = webLightTheme) => {
    FIcons.install(app);

    app.addPermanentHook("beforeModifyDOM", () => {
      const theme = light;
      const currentTheme = app.permanentData[currentFThemeSymbol];

      if (currentTheme === theme) return;

      for (const key in theme) {
        app.root.node.style.setProperty(
          `--${String(key)}`,
          String(theme[key as keyof Theme]),
        );
      }

      app.permanentData[currentFThemeSymbol] = theme;
    });
  },
);
export default FluentUI;
