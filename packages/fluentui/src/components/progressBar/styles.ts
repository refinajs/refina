import { tokens } from "@fluentui/tokens";
import { makeStyles, shorthands, mergeClasses } from "@refina/griffel";
import { FProgressBarColor, FProgressBarValue } from "./types";

export const progressBarClassNames = {
  root: "fui-ProgressBar",
  bar: "fui-ProgressBar__bar",
} as const;

// If the percentComplete is near 0, don't animate it.
// This prevents animations on reset to 0 scenarios.
const ZERO_THRESHOLD = 0.01;

const barThicknessValues = {
  medium: "2px",
  large: "4px",
};

const indeterminateProgressBar = {
  "0%": {
    left: "-33%", // matches indeterminate bar width
  },
  "100%": {
    left: "100%",
  },
};

const rootStyles = makeStyles({
  root: {
    display: "block",
    backgroundColor: tokens.colorNeutralBackground6,
    width: "100%",
    ...shorthands.overflow("hidden"),

    "@media screen and (forced-colors: active)": {
      backgroundColor: "CanvasText",
    },
  },
  rounded: {
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  square: {
    ...shorthands.borderRadius(tokens.borderRadiusNone),
  },
  medium: {
    height: barThicknessValues.medium,
  },
  large: {
    height: barThicknessValues.large,
  },
});

/**
 * Styles for the ProgressBar bar
 */
const barStyles = makeStyles({
  base: {
    "@media screen and (forced-colors: active)": {
      backgroundColor: "Highlight",
    },
    ...shorthands.borderRadius("inherit"),
    height: "100%",
  },
  nonZeroDeterminate: {
    transitionProperty: "width",
    transitionDuration: "0.3s",
    transitionTimingFunction: "ease",
  },
  indeterminate: {
    maxWidth: "33%",
    position: "relative",
    backgroundImage: `linear-gradient(
      to right,
      ${tokens.colorNeutralBackground6} 0%,
      ${tokens.colorTransparentBackground} 50%,
      ${tokens.colorNeutralBackground6} 100%
    )`,
    animationName: indeterminateProgressBar,
    animationDuration: "3s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    "@media screen and (prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms",
      animationIterationCount: "1",
    },
  },

  brand: {
    backgroundColor: tokens.colorCompoundBrandBackground,
  },

  error: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  warning: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground3,
  },
  success: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
  },
});
export default {
  root: mergeClasses(
    progressBarClassNames.root,
    rootStyles.root,
    rootStyles.rounded,
    rootStyles.medium,
  ),
  bar: (value: FProgressBarValue, color?: FProgressBarColor) =>
    mergeClasses(
      progressBarClassNames.bar,
      barStyles.base,
      barStyles.brand,
      value === "indertermine" && barStyles.indeterminate,
      value !== "indertermine" &&
        value > ZERO_THRESHOLD &&
        barStyles.nonZeroDeterminate,
      color && value !== "indertermine" && barStyles[color],
    ),
};
