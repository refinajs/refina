import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import { FTextareaAppearance, FTextareaResize } from "./types";

export const textareaClassNames = {
  root: "fui-Textarea",
  textarea: "fui-Textarea__textarea",
} as const;

/**
 * Styles for the root(wrapper) slot
 */
const rootStyles = makeStyles({
  base: {
    display: "inline-flex",
    boxSizing: "border-box",
    position: "relative",
    // Padding needed so the focus indicator does not overlap the resize handle, this should match focus indicator size.
    ...shorthands.padding("0", "0", tokens.strokeWidthThick, "0"),
    ...shorthands.margin("0"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },

  disabled: {
    backgroundColor: tokens.colorTransparentBackground,
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorNeutralStrokeDisabled,
    ),

    "@media (forced-colors: active)": {
      ...shorthands.borderColor("GrayText"),
    },
  },

  interactive: {
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
      height: `max(${tokens.strokeWidthThick}, ${tokens.borderRadiusMedium})`,
      borderBottomLeftRadius: tokens.borderRadiusMedium,
      borderBottomRightRadius: tokens.borderRadiusMedium,

      // Flat 2px border:
      // By default borderBottom will cause little "horns" on the ends. The clipPath trims them off.
      // (This could be done without trimming using `background: linear-gradient(...)`, but using
      // borderBottom makes it easier for people to override the color if needed.)
      ...shorthands.borderBottom(
        tokens.strokeWidthThick,
        "solid",
        tokens.colorCompoundBrandStroke,
      ),
      clipPath: `inset(calc(100% - ${tokens.strokeWidthThick}) 0 0 0)`,

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
      outlineWidth: tokens.strokeWidthThick,
      outlineStyle: "solid",
      outlineColor: "transparent",
    },
  },

  filled: {
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorTransparentStroke,
    ),
    ":hover,:focus-within": {
      ...shorthands.borderColor(tokens.colorTransparentStrokeInteractive),
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
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorTransparentStrokeInteractive,
    ),
    boxShadow: tokens.shadow2,
  },
  "filled-lighter-shadow": {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(
      tokens.strokeWidthThin,
      "solid",
      tokens.colorTransparentStrokeInteractive,
    ),
    boxShadow: tokens.shadow2,
  },

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
    ":hover": {
      ...shorthands.border(
        tokens.strokeWidthThin,
        "solid",
        tokens.colorNeutralStroke1Hover,
      ),
      borderBottomColor: tokens.colorNeutralStrokeAccessibleHover,
    },

    ":active": {
      ...shorthands.border(
        tokens.strokeWidthThin,
        "solid",
        tokens.colorNeutralStroke1Pressed,
      ),
      borderBottomColor: tokens.colorNeutralStrokeAccessiblePressed,
    },

    ":focus-within": {
      ...shorthands.border(
        tokens.strokeWidthThin,
        "solid",
        tokens.colorNeutralStroke1,
      ),
      borderBottomColor: tokens.colorCompoundBrandStroke,
    },
  },

  invalid: {
    ":not(:focus-within),:hover:not(:focus-within)": {
      ...shorthands.borderColor(tokens.colorPaletteRedBorder2),
    },
  },
});

/**
 * Styles for the textarea slot
 */
const textareaStyles = makeStyles({
  base: {
    ...shorthands.borderStyle("none"),
    ...shorthands.margin("0"),
    backgroundColor: "transparent",
    boxSizing: "border-box",
    color: tokens.colorNeutralForeground1,
    flexGrow: 1,
    fontFamily: tokens.fontFamilyBase,
    height: "100%",

    "::placeholder": {
      color: tokens.colorNeutralForeground4,
      opacity: 1,
    },

    "::selection": {
      color: tokens.colorNeutralForegroundInverted,
      backgroundColor: tokens.colorNeutralBackgroundInverted,
    },

    outlineStyle: "none", // disable default browser outline
  },

  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
    cursor: "not-allowed",
    "::placeholder": {
      color: tokens.colorNeutralForegroundDisabled,
    },
  },

  // The padding style adds both content and regular padding (from design spec), this is because the handle is not
  // affected by changing the padding of the root.
  small: {
    minHeight: "40px",
    ...shorthands.padding(
      tokens.spacingVerticalXS,
      `calc(${tokens.spacingHorizontalSNudge} + ${tokens.spacingHorizontalXXS})`,
    ),
    maxHeight: "200px",
    ...typographyStyles.caption1,
  },
  medium: {
    minHeight: "52px",
    ...shorthands.padding(
      tokens.spacingVerticalSNudge,
      `calc(${tokens.spacingHorizontalMNudge} + ${tokens.spacingHorizontalXXS})`,
    ),
    maxHeight: "260px",
    ...typographyStyles.body1,
  },
  large: {
    minHeight: "64px",
    ...shorthands.padding(
      tokens.spacingVerticalS,
      `calc(${tokens.spacingHorizontalM} + ${tokens.spacingHorizontalXXS})`,
    ),
    maxHeight: "320px",
    ...typographyStyles.body2,
  },
});

/**
 * Styles for the textarea's resize property
 */
const textareaResizeStyles = makeStyles({
  none: {
    resize: "none",
  },
  both: {
    resize: "both",
  },
  horizontal: {
    resize: "horizontal",
  },
  vertical: {
    resize: "vertical",
  },
});

export default (
  disabled: boolean,
  filled: boolean,
  invalid: boolean,
  appearance: FTextareaAppearance,
  resize: FTextareaResize,
) =>
  defineStyles({
    root: [
      textareaClassNames.root,
      rootStyles.base,
      disabled && rootStyles.disabled,
      !disabled && filled && rootStyles.filled,
      !disabled && rootStyles[appearance],
      !disabled && rootStyles.interactive,
      !disabled && appearance === "outline" && rootStyles.outlineInteractive,
      !disabled && invalid && rootStyles.invalid,
    ],
    textarea: [
      textareaClassNames.textarea,
      textareaStyles.base,
      textareaStyles.medium,
      textareaResizeStyles[resize],
      disabled && textareaStyles.disabled,
    ],
  });
