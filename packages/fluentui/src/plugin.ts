import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";
import FIcons from "@refina/fluentui-icons";
import { Plugin } from "refina";

const FluentUI = new Plugin(
  "fluentui",
  (app, dark: Theme = webDarkTheme, light: Theme = webLightTheme) => {
    FIcons.install(app);

    const theme = light;

    let css = `#root{\n`;
    for (const key in theme) {
      css += `--${key}:${theme[key as keyof Theme]};\n`;
    }
    css += `}`;

    const styleElement = document.createElement("style");
    styleElement.id = "fui-css-variables";
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
  },
);
export default FluentUI;
