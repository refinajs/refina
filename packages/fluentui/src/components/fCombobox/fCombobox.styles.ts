import { tokens, typographyStyles } from "@fluentui/tokens";
import { makeStyles, shorthands, mergeClasses } from "@refina/griffel";
import { iconSizes } from "./tokens";

export const comboboxClassNames = {
  root: "fui-Combobox",
  input: "fui-Combobox__input",
  expandIcon: "fui-Combobox__expandIcon",
  listbox: "fui-Combobox__listbox",
} as const;

// Matches internal heights for Select and Input, but there are no theme variables for these
// field heights are 2px less than other controls, since the border is on the parent element.
const fieldHeights = {
  small: "22px",
  medium: "30px",
  large: "38px",
};

const styles = makeStyles({
  root: {
    alignItems: "center",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxSizing: "border-box",
    columnGap: tokens.spacingHorizontalXXS,
    display: "inline-grid",
    gridTemplateColumns: "1fr auto",
    justifyContent: "space-between",
    minWidth: "250px",
    position: "relative",

    // windows high contrast mode focus indicator
    ":focus-within": {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "transparent",
    },

    // bottom focus border, shared with Input, Select, and SpinButton
    "::after": {
      boxSizing: "border-box",
      content: '""',
      position: "absolute",
      left: "-1px",
      bottom: "-1px",
      right: "-1px",
      height: `max(2px, ${tokens.borderRadiusMedium})`,
      borderBottomLeftRadius: tokens.borderRadiusMedium,
      borderBottomRightRadius: tokens.borderRadiusMedium,
      ...shorthands.borderBottom(
        tokens.strokeWidthThick,
        "solid",
        tokens.colorCompoundBrandStroke,
      ),
      clipPath: "inset(calc(100% - 2px) 0 0 0)",
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
      borderBottomColor: tokens.colorCompoundBrandStrokePressed,
    },
  },

  listbox: {
    boxShadow: `${tokens.shadow16}`,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    maxHeight: "80vh",
  },

  listboxCollapsed: {
    display: "none",
  },

  // size variants
  small: {
    paddingRight: tokens.spacingHorizontalSNudge,
  },
  medium: {
    paddingRight: tokens.spacingHorizontalMNudge,
  },
  large: {
    columnGap: tokens.spacingHorizontalSNudge,
    paddingRight: tokens.spacingHorizontalM,
  },

  // appearance variants
  outline: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorNeutralStroke1,
    ),
    borderBottomColor: tokens.colorNeutralStrokeAccessible,
  },

  outlineInteractive: {
    "&:hover": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      borderBottomColor: tokens.colorNeutralStrokeAccessible,
    },

    "&:active": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Pressed),
      borderBottomColor: tokens.colorNeutralStrokeAccessible,
    },
  },
  underline: {
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.borderBottom(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorNeutralStrokeAccessible,
    ),
    ...shorthands.borderRadius(0),
  },
  "filled-lighter": {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorTransparentStroke,
    ),
  },
  "filled-darker": {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorTransparentStroke,
    ),
  },
  invalid: {
    ":not(:focus-within),:hover:not(:focus-within)": {
      ...shorthands.borderColor(tokens.colorPaletteRedBorder2),
    },
  },
  invalidUnderline: {
    ":not(:focus-within),:hover:not(:focus-within)": {
      borderBottomColor: tokens.colorPaletteRedBorder2,
    },
  },

  disabled: {
    cursor: "not-allowed",
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.borderColor(tokens.colorNeutralStrokeDisabled),
    "@media (forced-colors: active)": {
      ...shorthands.borderColor("GrayText"),
    },
  },
});

const inputStyles = makeStyles({
  input: {
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.border("0"),
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,

    "&:focus": {
      outlineStyle: "none",
    },

    "&::placeholder": {
      color: tokens.colorNeutralForeground4,
      opacity: 1,
    },
  },

  // size variants
  small: {
    height: fieldHeights.small,
    ...typographyStyles.caption1,
    ...shorthands.padding(
      0,
      0,
      0,
      `calc(${tokens.spacingHorizontalSNudge} + ${tokens.spacingHorizontalXXS})`,
    ),
  },
  medium: {
    height: fieldHeights.medium,
    ...typographyStyles.body1,
    ...shorthands.padding(
      0,
      0,
      0,
      `calc(${tokens.spacingHorizontalMNudge} + ${tokens.spacingHorizontalXXS})`,
    ),
  },
  large: {
    height: fieldHeights.large,
    ...typographyStyles.body2,
    ...shorthands.padding(
      0,
      0,
      0,
      `calc(${tokens.spacingHorizontalM} + ${tokens.spacingHorizontalSNudge})`,
    ),
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

const iconStyles = makeStyles({
  icon: {
    boxSizing: "border-box",
    color: tokens.colorNeutralStrokeAccessible,
    cursor: "pointer",
    display: "block",
    fontSize: tokens.fontSizeBase500,

    // the SVG must have display: block for accurate positioning
    // otherwise an extra inline space is inserted after the svg element
    "& svg": {
      display: "block",
    },
  },

  // icon size variants
  small: {
    fontSize: iconSizes.small,
    marginLeft: tokens.spacingHorizontalXXS,
  },
  medium: {
    fontSize: iconSizes.medium,
    marginLeft: tokens.spacingHorizontalXXS,
  },
  large: {
    fontSize: iconSizes.large,
    marginLeft: tokens.spacingHorizontalSNudge,
  },
  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
    cursor: "not-allowed",
  },
});

export default {
  root: (disabled: boolean, invalid: boolean) =>
    mergeClasses(
      comboboxClassNames.root,
      styles.root,
      styles.outline,
      styles.medium,
      !disabled && styles.outlineInteractive,
      invalid && styles.invalid,
      disabled && styles.disabled,
    ),
  input: (disabled: boolean) =>
    mergeClasses(
      comboboxClassNames.input,
      inputStyles.input,
      inputStyles.medium,
      disabled && inputStyles.disabled,
    ),
  listbox: mergeClasses(
    comboboxClassNames.listbox,
    styles.listbox,
    !open && styles.listboxCollapsed,
  ),
  expandIcon: (disabled: boolean) =>
    mergeClasses(
      comboboxClassNames.expandIcon,
      iconStyles.icon,
      iconStyles.medium,
      disabled && iconStyles.disabled,
    ),
};
