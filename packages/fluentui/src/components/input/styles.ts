import { tokens, typographyStyles } from "@fluentui/tokens";
import {
  defineStyles,
  makeResetStyles,
  makeStyles,
  shorthands,
} from "@refina/griffel";
import { FInputAppearance } from "./types";

export const inputClassNames = {
  root: "fui-Input",
  input: "fui-Input__input",
  contentBefore: "fui-Input__contentBefore",
  contentAfter: "fui-Input__contentAfter",
} as const;

// TODO(sharing) should these be shared somewhere?
const fieldHeights = {
  small: "24px",
  medium: "32px",
  large: "40px",
};

const rootClassName = makeResetStyles({
  display: "inline-flex",
  alignItems: "center",
  flexWrap: "nowrap",
  gap: tokens.spacingHorizontalXXS,
  borderRadius: tokens.borderRadiusMedium, // used for all but underline
  position: "relative",
  boxSizing: "border-box",

  // size: medium (default)
  minHeight: fieldHeights.medium,
  padding: `0 ${tokens.spacingHorizontalMNudge}`,
  ...typographyStyles.body1,

  // appearance: outline (default)
  backgroundColor: tokens.colorNeutralBackground1,
  border: `1px solid ${tokens.colorNeutralStroke1}`,
  borderBottomColor: tokens.colorNeutralStrokeAccessible,

  // This is all for the bottom focus border.
  // It's supposed to be 2px flat all the way across and match the radius of the field's corners.
  "::after": {
    boxSizing: "border-box",
    content: '""',
    position: "absolute",
    left: "-1px",
    bottom: "-1px",
    right: "-1px",

    // Maintaining the correct corner radius:
    // Use the whole border-radius as the height and only put radii on the bottom corners.
    // (Otherwise the radius would be automatically reduced to fit available space.)
    // max() ensures the focus border still shows up even if someone sets tokens.borderRadiusMedium to 0.
    height: `max(2px, ${tokens.borderRadiusMedium})`,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,

    // Flat 2px border:
    // By default borderBottom will cause little "horns" on the ends. The clipPath trims them off.
    // (This could be done without trimming using `background: linear-gradient(...)`, but using
    // borderBottom makes it easier for people to override the color if needed.)
    borderBottom: `2px solid ${tokens.colorCompoundBrandStroke}`,
    clipPath: "inset(calc(100% - 2px) 0 0 0)",

    // Animation for focus OUT
    transform: "scaleX(0)",
    transitionProperty: "transform",
    transitionDuration: tokens.durationUltraFast,
    transitionDelay: tokens.curveAccelerateMid,

    "@media screen and (prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
      transitionDelay: "0.01ms",
    },
  },
  ":focus-within::after": {
    // Animation for focus IN
    transform: "scaleX(1)",
    transitionProperty: "transform",
    transitionDuration: tokens.durationNormal,
    transitionDelay: tokens.curveDecelerateMid,

    "@media screen and (prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
      transitionDelay: "0.01ms",
    },
  },
  ":focus-within:active::after": {
    // This is if the user clicks the field again while it's already focused
    borderBottomColor: tokens.colorCompoundBrandStrokePressed,
  },
  ":focus-within": {
    outline: "2px solid transparent",
  },
});

const rootStyles = makeStyles({
  small: {
    minHeight: fieldHeights.small,
    paddingLeft: tokens.spacingHorizontalSNudge,
    paddingRight: tokens.spacingHorizontalSNudge,
    ...typographyStyles.caption1,
  },
  medium: {
    // included in rootBaseStyles
  },
  large: {
    minHeight: fieldHeights.large,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    ...typographyStyles.body2,
    ...shorthands.gap(tokens.spacingHorizontalSNudge),
  },
  outline: {
    // included in rootBaseStyles
  },
  outlineInteractive: {
    ":hover": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      borderBottomColor: tokens.colorNeutralStrokeAccessibleHover,
    },
    // DO NOT add a space between the selectors! It changes the behavior of make-styles.
    ":active,:focus-within": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Pressed),
      borderBottomColor: tokens.colorNeutralStrokeAccessiblePressed,
    },
  },
  underline: {
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.borderRadius(0), // corners look strange if rounded
    // border is specified in rootBaseStyles, but we only want a bottom border here
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderLeftStyle: "none",
    // Make the focus underline (::after) match the width of the bottom border
    "::after": {
      left: 0,
      right: 0,
    },
  },
  underlineInteractive: {
    ":hover": {
      borderBottomColor: tokens.colorNeutralStrokeAccessibleHover,
    },
    // DO NOT add a space between the selectors! It changes the behavior of make-styles.
    ":active,:focus-within": {
      borderBottomColor: tokens.colorNeutralStrokeAccessiblePressed,
    },
    "::after": shorthands.borderRadius(0), // remove rounded corners from focus underline
  },
  filled: {
    ...shorthands.borderColor(tokens.colorTransparentStroke),
  },
  filledInteractive: {
    // DO NOT add a space between the selectors! It changes the behavior of make-styles.
    ":hover,:focus-within": {
      // also handles pressed border color (:active)
      ...shorthands.borderColor(tokens.colorTransparentStrokeInteractive),
    },
  },
  invalid: {
    ":not(:focus-within),:hover:not(:focus-within)": {
      ...shorthands.borderColor(tokens.colorPaletteRedBorder2),
    },
  },
  "filled-darker": {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  "filled-lighter": {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  "filled-darker-shadow": {
    backgroundColor: tokens.colorNeutralBackground3,
    boxShadow: tokens.shadow2,
  },
  "filled-lighter-shadow": {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
  },
  disabled: {
    cursor: "not-allowed",
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.borderColor(tokens.colorNeutralStrokeDisabled),
    "@media (forced-colors: active)": {
      ...shorthands.borderColor("GrayText"),
    },
    // remove the focus border
    "::after": {
      content: "unset",
    },
    // remove the focus outline
    ":focus-within": {
      outlineStyle: "none",
    },
  },
});

const inputClassName = makeResetStyles({
  boxSizing: "border-box",
  flexGrow: 1,
  minWidth: 0, // required to make the input shrink to fit the wrapper
  borderStyle: "none", // input itself never has a border (this is handled by inputWrapper)
  padding: `0 ${tokens.spacingHorizontalXXS}`,
  color: tokens.colorNeutralForeground1,
  // Use literal "transparent" (not from the theme) to always let the color from the root show through
  backgroundColor: "transparent",

  "::placeholder": {
    color: tokens.colorNeutralForeground4,
    opacity: 1, // browser style override
  },

  outlineStyle: "none", // disable default browser outline

  // Inherit typography styles from root
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
});

const inputElementStyles = makeStyles({
  large: {
    paddingLeft: tokens.spacingHorizontalSNudge,
    paddingRight: tokens.spacingHorizontalSNudge,
  },
  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
    backgroundColor: tokens.colorTransparentBackground,
    cursor: "not-allowed",
    "::placeholder": {
      color: tokens.colorNeutralForegroundDisabled,
    },
  },
});

const contentClassName = makeResetStyles({
  boxSizing: "border-box",
  color: tokens.colorNeutralForeground3, // "icon color" in design spec
  display: "flex",
  // special case styling for icons (most common case) to ensure they're centered vertically
  // size: medium (default)
  "> svg": { fontSize: "20px" },
});

const contentStyles = makeStyles({
  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
  },
  // Ensure resizable icons show up with the proper font size
  small: {
    "> svg": { fontSize: "16px" },
  },
  medium: {
    // included in useContentClassName
  },
  large: {
    "> svg": { fontSize: "24px" },
  },
});

export default (
  appearance: FInputAppearance,
  disabled: boolean,
  invalid: boolean,
) =>
  defineStyles({
    root: [
      inputClassNames.root,
      rootClassName,
      rootStyles.medium,
      rootStyles[appearance],
      !disabled && appearance === "outline" && rootStyles.outlineInteractive,
      !disabled &&
        appearance === "underline" &&
        rootStyles.underlineInteractive,
      !disabled && appearance === "filled" && rootStyles.filledInteractive,
      appearance === "filled" && rootStyles.filled,
      !disabled && invalid && rootStyles.invalid,
      disabled && rootStyles.disabled,
    ],
    input: [
      inputClassNames.input,
      inputClassName,
      disabled && inputElementStyles.disabled,
    ],
    contentBefore: [
      inputClassNames.contentBefore,
      contentClassName,
      disabled && contentStyles.disabled,
      contentStyles.medium,
    ],
    contentAfter: [
      inputClassNames.contentAfter,
      contentClassName,
      disabled && contentStyles.disabled,
      contentStyles.medium,
    ],
  });
