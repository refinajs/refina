import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import { createFocusOutlineStyle } from "../../../focus";

export const accordionHeaderClassNames = {
  root: "fui-AccordionHeader",
  button: "fui-AccordionHeader__button",
  expandIcon: "fui-AccordionHeader__expandIcon",
  icon: "fui-AccordionHeader__icon",
} as const;

const styles = makeStyles({
  // TODO: this should be extracted to another package
  resetButton: {
    boxSizing: "content-box",
    backgroundColor: "inherit",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "normal",
    ...shorthands.overflow("visible"),
    ...shorthands.padding(0),
    WebkitAppearance: "button",
    textAlign: "unset",
  },
  focusIndicator: createFocusOutlineStyle(),
  root: {
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.margin(0),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  rootDisabled: {
    backgroundImage: "none",
    color: tokens.colorNeutralForegroundDisabled,
  },
  rootInline: {
    display: "inline-block",
  },
  button: {
    position: "relative",
    width: "100%",
    ...shorthands.border("1px", "solid", "transparent"),
    ...shorthands.padding(
      0,
      tokens.spacingHorizontalM,
      0,
      tokens.spacingHorizontalMNudge,
    ),
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    ...typographyStyles.body1,
    boxSizing: "border-box",
  },
  buttonSmall: {
    minHeight: "32px",
    fontSize: tokens.fontSizeBase200,
  },
  buttonLarge: {
    lineHeight: tokens.lineHeightBase400,
    fontSize: tokens.fontSizeBase400,
  },
  buttonExtraLarge: {
    lineHeight: tokens.lineHeightBase500,
    fontSize: tokens.fontSizeBase500,
  },
  buttonInline: {
    display: "inline-flex",
  },
  buttonExpandIconEndNoIcon: {
    paddingLeft: tokens.spacingHorizontalM,
  },
  buttonExpandIconEnd: {
    paddingRight: tokens.spacingHorizontalMNudge,
  },
  buttonDisabled: {
    cursor: "not-allowed",
  },
  expandIcon: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    lineHeight: tokens.lineHeightBase500,
    fontSize: tokens.fontSizeBase500,
  },
  expandIconStart: {
    paddingRight: tokens.spacingHorizontalS,
  },
  expandIconEnd: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    display: "flex",
    justifyContent: "flex-end",
    paddingLeft: tokens.spacingHorizontalS,
  },
  icon: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingRight: tokens.spacingHorizontalS,
    lineHeight: tokens.lineHeightBase500,
    fontSize: tokens.fontSizeBase500,
  },
});

export default (disabled: boolean) =>
  defineStyles({
    root: [
      accordionHeaderClassNames.root,
      styles.root,
      disabled && styles.rootDisabled,
    ],
    button: [
      accordionHeaderClassNames.button,
      styles.resetButton,
      styles.button,
      styles.focusIndicator,
      disabled && styles.buttonDisabled,
    ],
    expandIcon: [
      accordionHeaderClassNames.expandIcon,
      styles.expandIcon,
      styles.expandIconStart,
    ],
    icon: [accordionHeaderClassNames.icon, styles.icon],
  });
