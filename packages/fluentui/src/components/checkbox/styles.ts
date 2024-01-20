import { tokens } from "@fluentui/tokens";
import {
  defineStyles,
  makeResetStyles,
  makeStyles,
  shorthands,
} from "@refina/griffel";
import { createFocusOutlineStyle } from "../../focus";

export const checkboxClassNames = {
  root: "fui-Checkbox",
  label: "fui-Checkbox__label",
  input: "fui-Checkbox__input",
  indicator: "fui-Checkbox__indicator",
} as const;

// The indicator size is used by the indicator and label styles
const indicatorSizeMedium = "16px";
const indicatorSizeLarge = "20px";

const rootBaseClassName = makeResetStyles({
  position: "relative",
  display: "inline-flex",
  cursor: "pointer",
  verticalAlign: "middle",
  color: tokens.colorNeutralForeground3,
  ...createFocusOutlineStyle({ style: {}, selector: "focus-within" }),
});

const rootStyles = makeStyles({
  unchecked: {
    ":hover": {
      color: tokens.colorNeutralForeground2,
      [`> .${checkboxClassNames.indicator}`]: {
        ...shorthands.borderColor(tokens.colorNeutralStrokeAccessibleHover),
      },
    },

    ":active": {
      color: tokens.colorNeutralForeground1,
      [`> .${checkboxClassNames.indicator}`]: {
        ...shorthands.borderColor(tokens.colorNeutralStrokeAccessiblePressed),
      },
    },
  },

  checked: {
    color: tokens.colorNeutralForeground1,

    [`> .${checkboxClassNames.indicator}`]: {
      backgroundColor: tokens.colorCompoundBrandBackground,
      color: tokens.colorNeutralForegroundInverted,
      ...shorthands.borderColor(tokens.colorCompoundBrandBackground),
    },

    ":hover": {
      [`> .${checkboxClassNames.indicator}`]: {
        backgroundColor: tokens.colorCompoundBrandBackgroundHover,
        ...shorthands.borderColor(tokens.colorCompoundBrandBackgroundHover),
      },
    },

    ":active": {
      [`> .${checkboxClassNames.indicator}`]: {
        backgroundColor: tokens.colorCompoundBrandBackgroundPressed,
        ...shorthands.borderColor(tokens.colorCompoundBrandBackgroundPressed),
      },
    },
  },

  mixed: {
    color: tokens.colorNeutralForeground1,

    [`> .${checkboxClassNames.indicator}`]: {
      ...shorthands.borderColor(tokens.colorCompoundBrandStroke),
      color: tokens.colorCompoundBrandForeground1,
    },

    ":hover": {
      [`> .${checkboxClassNames.indicator}`]: {
        ...shorthands.borderColor(tokens.colorCompoundBrandStrokeHover),
        color: tokens.colorCompoundBrandForeground1Hover,
      },
    },

    ":active": {
      [`> .${checkboxClassNames.indicator}`]: {
        ...shorthands.borderColor(tokens.colorCompoundBrandStrokePressed),
        color: tokens.colorCompoundBrandForeground1Pressed,
      },
    },
  },

  disabled: {
    cursor: "default",

    color: tokens.colorNeutralForegroundDisabled,

    [`> .${checkboxClassNames.indicator}`]: {
      ...shorthands.borderColor(tokens.colorNeutralStrokeDisabled),
      color: tokens.colorNeutralForegroundDisabled,
    },

    "@media (forced-colors: active)": {
      color: "GrayText",
      [`> .${checkboxClassNames.indicator}`]: {
        color: "GrayText",
      },
    },
  },
});

const inputBaseClassName = makeResetStyles({
  boxSizing: "border-box",
  cursor: "inherit",
  height: "100%",
  margin: 0,
  opacity: 0,
  position: "absolute",
  top: 0,
  // Calculate the width of the hidden input by taking into account the size of the indicator + the padding around it.
  // This is done so that clicking on that "empty space" still toggles the checkbox.
  width: `calc(${indicatorSizeMedium} + 2 * ${tokens.spacingHorizontalS})`,
});

const inputStyles = makeStyles({
  before: {
    right: 0,
  },
  after: {
    left: 0,
  },

  large: {
    width: `calc(${indicatorSizeLarge} + 2 * ${tokens.spacingHorizontalS})`,
  },
});

const indicatorBaseClassName = makeResetStyles({
  alignSelf: "flex-start",
  boxSizing: "border-box",
  flexShrink: 0,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",

  border:
    tokens.strokeWidthThin + " solid " + tokens.colorNeutralStrokeAccessible,
  borderRadius: tokens.borderRadiusSmall,
  margin: tokens.spacingVerticalS + " " + tokens.spacingHorizontalS,
  fill: "currentColor",
  pointerEvents: "none",

  fontSize: "12px",
  height: indicatorSizeMedium,
  width: indicatorSizeMedium,
});

const useIndicatorStyles = makeStyles({
  large: {
    fontSize: "16px",
    height: indicatorSizeLarge,
    width: indicatorSizeLarge,
  },

  circular: {
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
});

// Can't use makeResetStyles here because Label is a component that may itself use makeResetStyles.
const labelStyles = makeStyles({
  base: {
    alignSelf: "center",
    color: "inherit",
    cursor: "inherit",
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
  },

  before: {
    paddingRight: tokens.spacingHorizontalXS,
  },
  after: {
    paddingLeft: tokens.spacingHorizontalXS,
  },

  // Use a (negative) margin to account for the difference between the indicator's height and the label's line height.
  // This prevents the label from expanding the height of the checkbox, but preserves line height if the label wraps.
  medium: {
    marginTop: `calc((${indicatorSizeMedium} - ${tokens.lineHeightBase300}) / 2)`,
    marginBottom: `calc((${indicatorSizeMedium} - ${tokens.lineHeightBase300}) / 2)`,
  },
  large: {
    marginTop: `calc((${indicatorSizeLarge} - ${tokens.lineHeightBase300}) / 2)`,
    marginBottom: `calc((${indicatorSizeLarge} - ${tokens.lineHeightBase300}) / 2)`,
  },
});

export default (disabled: boolean, checked: boolean | "mixed") =>
  defineStyles({
    root: [
      checkboxClassNames.root,
      rootBaseClassName,
      disabled
        ? rootStyles.disabled
        : checked === "mixed"
        ? rootStyles.mixed
        : checked
        ? rootStyles.checked
        : rootStyles.unchecked,
    ],
    input: [checkboxClassNames.input, inputBaseClassName, inputStyles.after],
    indicator: [checkboxClassNames.indicator, indicatorBaseClassName],
    label: [
      checkboxClassNames.label,
      labelStyles.base,
      labelStyles.medium,
      labelStyles.after,
    ],
  });
