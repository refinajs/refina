import { tokens } from "@fluentui/tokens";
import { makeStyles, shorthands } from "@refina/griffel";

export const tabIndicatorCssVars = {
  offsetVar: "--fui-Tab__indicator--offset",
  scaleVar: "--fui-Tab__indicator--scale",
} as const;

export const activeIndicatorStyles = makeStyles({
  base: {
    // overflow is required to allow the selection indicator to animate outside the tab area.
    ...shorthands.overflow("visible"),
  },
  animated: {
    "::after": {
      transitionProperty: "transform",
      transitionDuration: `${tokens.durationSlow}`,
      transitionTimingFunction: `${tokens.curveDecelerateMax}`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      "::after": {
        transitionProperty: "none",
        transitionDuration: "0.01ms",
      },
    },
  },
  horizontal: {
    "::after": {
      transformOrigin: "left",
      transform: `translateX(var(${tabIndicatorCssVars.offsetVar}))
    scaleX(var(${tabIndicatorCssVars.scaleVar}))`,
    },
  },
  vertical: {
    "::after": {
      transformOrigin: "top",
      transform: `translateY(var(${tabIndicatorCssVars.offsetVar}))
        scaleY(var(${tabIndicatorCssVars.scaleVar}))`,
    },
  },
});
