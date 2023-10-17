export { default as FIcons } from "@refina/fluentui-icons";
export * from "./components";
export * from "./positioning";

import FluentUI from "./plugin";
export default FluentUI;

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
