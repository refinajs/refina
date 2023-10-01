import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";

export let darkTheme: Theme = webDarkTheme;
export let lightTheme: Theme = webLightTheme;

export function setTheme(dark: Theme, light: Theme) {
  darkTheme = dark;
  lightTheme = light;

  const theme = light;

  for (const key in theme) {
    document.body.style.setProperty(
      `--${String(key)}`,
      String(theme[key as keyof Theme]),
    );
  }
}

export {
  type BrandVariants,
  type Theme,
  createDarkTheme,
  createLightTheme,
} from "@fluentui/tokens";
