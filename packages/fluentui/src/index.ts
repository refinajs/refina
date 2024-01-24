import { Theme, webDarkTheme, webLightTheme } from "@fluentui/tokens";
import { Plugin } from "refina";
import * as c from "./components";
import { usePositioning } from "./positioning";

export default function (
  dark: Theme = webDarkTheme,
  light: Theme = webLightTheme,
) {
  return {
    name: "fluentui",
    components: {
      fAccordion: c.FAccordion,
      fAccordionPanel: c.FAccordionPanel,
      fAvatar: c.FAvatar,
      fBreadcrumb: c.FBreadcrumb,
      fButton: c.FButton,
      fCircularButton: c.FCircularButton,
      fSquareButton: c.FSquareButton,
      fPrimaryButton: c.FPrimaryButton,
      fSecondaryButton: c.FSecondaryButton,
      fSubtleButton: c.FSubtleButton,
      fTransparentButton: c.FTransparentButton,
      fCheckbox: c.FCheckbox,
      fControlledDialog: c.FControlledDialog,
      fDialog: c.FDialog,
      fDialogBody: c.FDialogBody,
      fDialogSurface: c.FDialogSurface,
      fDivider: c.FDivider,
      fDropdown: c.FDropdown,
      fField: c.FField,
      fInput: c.FInput,
      fNumberInput: c.FNumberInput,
      fPasswordInput: c.FPasswordInput,
      fUnderlineInput: c.FUnderlineInput,
      fUnderlineNumberInput: c.FUnderlineNumberInput,
      fUnderlinePasswordInput: c.FUnderlinePasswordInput,
      fLabel: c.FLabel,
      fPopover: c.FPopover,
      fPortal: c.FPortal,
      fProgressBar: c.FProgressBar,
      fSlider: c.FSlider,
      fSwitch: c.FSwitch,
      fTabs: c.FTabs,
      fTab: c.FTab,
      fTabList: c.FTabList,
      fTextarea: c.FTextarea,
      fTooltip: c.FTooltip,
    },
    contextFuncs: {
      usePositioning,
    },
    onInstall() {
      const theme = light;

      let css = `:root{\n`;
      for (const key in theme) {
        css += `--${key}:${theme[key as keyof Theme]};\n`;
      }
      css += `}`;

      const styleElement = document.createElement("style");
      styleElement.id = "fui-css-variables";
      styleElement.innerHTML = css;
      document.head.appendChild(styleElement);
    },
  } satisfies Plugin;
}

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
export * from "./components";
export * from "./positioning";
