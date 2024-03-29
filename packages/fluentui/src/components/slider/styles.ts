import { tokens } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import { createFocusOutlineStyle } from "../../focus";

export const sliderClassNames = {
  root: "fui-Slider",
  rail: "fui-Slider__rail",
  thumb: "fui-Slider__thumb",
  input: "fui-Slider__input",
} as const;

// Internal CSS variables
const thumbSizeVar = `--fui-Slider__thumb--size`;
const railSizeVar = `--fui-Slider__rail--size`;
const railColorVar = `--fui-Slider__rail--color`;
const progressColorVar = `--fui-Slider__progress--color`;
const thumbColorVar = `--fui-Slider__thumb--color`;

export const sliderCSSVars = {
  sliderDirectionVar: `--fui-Slider--direction`,
  sliderProgressVar: `--fui-Slider--progress`,
  sliderStepsPercentVar: `--fui-Slider--steps-percent`,
};

const { sliderDirectionVar, sliderStepsPercentVar, sliderProgressVar } =
  sliderCSSVars;

/**
 * Styles for the root slot
 */
const rootStyles = makeStyles({
  root: {
    position: "relative",
    display: "inline-grid",
    touchAction: "none",
    alignItems: "center",
    justifyItems: "center",
  },

  small: {
    [thumbSizeVar]: "16px",
    [railSizeVar]: "2px",
    minHeight: "24px",
  },

  medium: {
    [thumbSizeVar]: "20px",
    [railSizeVar]: "4px",
    minHeight: "32px",
  },

  horizontal: {
    minWidth: "120px",
    // 3x3 grid with the rail and thumb in the center cell [2,2] and the hidden input stretching across all cells
    gridTemplateRows: `1fr var(${thumbSizeVar}) 1fr`,
    gridTemplateColumns: `1fr calc(100% - var(${thumbSizeVar})) 1fr`,
  },

  vertical: {
    minHeight: "120px",
    // 3x3 grid with the rail and thumb in the center cell [2,2] and the hidden input stretching across all cells
    gridTemplateRows: `1fr calc(100% - var(${thumbSizeVar})) 1fr`,
    gridTemplateColumns: `1fr var(${thumbSizeVar}) 1fr`,
  },

  enabled: {
    [railColorVar]: tokens.colorNeutralStrokeAccessible,
    [progressColorVar]: tokens.colorCompoundBrandBackground,
    [thumbColorVar]: tokens.colorCompoundBrandBackground,
    ":hover": {
      [thumbColorVar]: tokens.colorCompoundBrandBackgroundHover,
      [progressColorVar]: tokens.colorCompoundBrandBackgroundHover,
    },
    ":active": {
      [thumbColorVar]: tokens.colorCompoundBrandBackgroundPressed,
      [progressColorVar]: tokens.colorCompoundBrandBackgroundPressed,
    },
    "@media (forced-colors: active)": {
      [railColorVar]: "CanvasText",
      [thumbColorVar]: "Highlight",
      [progressColorVar]: "Highlight",
      ":hover": {
        [thumbColorVar]: "Highlight",
        [progressColorVar]: "Highlight",
      },
    },
  },

  disabled: {
    [thumbColorVar]: tokens.colorNeutralForegroundDisabled,
    [railColorVar]: tokens.colorNeutralBackgroundDisabled,
    [progressColorVar]: tokens.colorNeutralForegroundDisabled,
    "@media (forced-colors: active)": {
      [railColorVar]: "GrayText",
      [thumbColorVar]: "GrayText",
      [progressColorVar]: "GrayText",
    },
  },

  focusIndicatorHorizontal: createFocusOutlineStyle({
    selector: "focus-within",
    style: {
      outlineOffset: { top: "-2px", bottom: "-2px", left: "8px", right: "8px" },
    },
  }),

  focusIndicatorVertical: createFocusOutlineStyle({
    selector: "focus-within",
    style: {
      outlineOffset: { top: "6px", bottom: "6px", left: "4px", right: "4px" },
    },
  }),
});

/**
 * Styles for the rail slot
 */
const railStyles = makeStyles({
  rail: {
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    pointerEvents: "none",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "2",
    position: "relative",
    forcedColorAdjust: "none",
    // Background gradient represents the progress of the slider
    backgroundImage: `linear-gradient(
      var(${sliderDirectionVar}),
      var(${progressColorVar}) 0%,
      var(${progressColorVar}) var(${sliderProgressVar}),
      var(${railColorVar}) var(${sliderProgressVar})
    )`,
    outlineWidth: "1px",
    outlineStyle: "solid",
    outlineColor: tokens.colorTransparentStroke,
    "::before": {
      content: "''",
      position: "absolute",
      // Repeating gradient represents the steps if provided
      backgroundImage: `repeating-linear-gradient(
        var(${sliderDirectionVar}),
        #0000 0%,
        #0000 calc(var(${sliderStepsPercentVar}) - 1px),
        ${tokens.colorNeutralBackground1} calc(var(${sliderStepsPercentVar}) - 1px),
        ${tokens.colorNeutralBackground1} var(${sliderStepsPercentVar})
      )`,
      // force steps to use HighlightText for high contrast mode
      "@media (forced-colors: active)": {
        backgroundImage: `repeating-linear-gradient(
          var(${sliderDirectionVar}),
          #0000 0%,
          #0000 calc(var(${sliderStepsPercentVar}) - 1px),
          HighlightText calc(var(${sliderStepsPercentVar}) - 1px),
          HighlightText var(${sliderStepsPercentVar})
        )`,
      },
    },
  },

  horizontal: {
    width: "100%",
    height: `var(${railSizeVar})`,
    "::before": {
      left: "-1px",
      right: "-1px",
      height: `var(${railSizeVar})`,
    },
  },

  vertical: {
    width: `var(${railSizeVar})`,
    height: "100%",
    "::before": {
      width: `var(${railSizeVar})`,
      top: "-1px",
      bottom: "1px",
    },
  },
});

/**
 * Styles for the thumb slot
 */
const thumbStyles = makeStyles({
  thumb: {
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "2",
    position: "absolute",
    width: `var(${thumbSizeVar})`,
    height: `var(${thumbSizeVar})`,
    pointerEvents: "none",
    outlineStyle: "none",
    forcedColorAdjust: "none",
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    boxShadow: `0 0 0 calc(var(${thumbSizeVar}) * .2) ${tokens.colorNeutralBackground1} inset`,
    backgroundColor: `var(${thumbColorVar})`,
    "::before": {
      position: "absolute",
      top: "0px",
      left: "0px",
      bottom: "0px",
      right: "0px",
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      boxSizing: "border-box",
      content: "''",
      ...shorthands.border(
        `calc(var(${thumbSizeVar}) * .05)`,
        "solid",
        tokens.colorNeutralStroke1,
      ),
    },
  },
  disabled: {
    "::before": {
      ...shorthands.border(
        `calc(var(${thumbSizeVar}) * .05)`,
        "solid",
        tokens.colorNeutralForegroundDisabled,
      ),
    },
  },
  horizontal: {
    transform: "translateX(-50%)",
    left: `var(${sliderProgressVar})`,
  },
  vertical: {
    transform: "translateY(50%)",
    bottom: `var(${sliderProgressVar})`,
  },
});

/**
 * Styles for the Input slot
 */
const inputStyles = makeStyles({
  input: {
    cursor: "pointer",
    opacity: 0,
    gridRowStart: "1",
    gridRowEnd: "-1",
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    ...shorthands.padding(0),
    ...shorthands.margin(0),
  },
  disabled: {
    cursor: "default",
  },
  horizontal: {
    height: `var(${thumbSizeVar})`,
    width: "100%",
  },
  vertical: {
    height: "100%",
    width: `var(${thumbSizeVar})`,
    "-webkit-appearance": "slider-vertical",
  },
});

export default (disabled: boolean) =>
  defineStyles({
    root: [
      sliderClassNames.root,
      rootStyles.root,
      rootStyles.focusIndicatorHorizontal,
      rootStyles.medium,
      rootStyles.horizontal,
      disabled ? rootStyles.disabled : rootStyles.enabled,
    ],
    rail: [sliderClassNames.rail, railStyles.rail, railStyles.horizontal],
    thumb: [
      sliderClassNames.thumb,
      thumbStyles.thumb,
      thumbStyles.horizontal,
      disabled && thumbStyles.disabled,
    ],
    input: [
      sliderClassNames.input,
      inputStyles.input,
      inputStyles.horizontal,
      disabled && inputStyles.disabled,
    ],
  });
