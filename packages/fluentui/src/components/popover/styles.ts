import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import {
  createArrowHeightStyles,
  createArrowStyles,
  createSlideStyles,
} from "../../positioning";

export const popoverSurfaceClassNames = {
  root: "fui-PopoverSurface",
} as const;

export const arrowHeights = {
  small: 6,
  medium: 8,
  large: 8,
} as const;

/**
 * Styles for the root slot
 */
const styles = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorTransparentStroke),
    ...typographyStyles.body1,
    ...createSlideStyles(10),
  },

  inverted: {
    backgroundColor: tokens.colorNeutralBackgroundStatic,
    color: tokens.colorNeutralForegroundStaticInverted,
  },

  brand: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },

  smallPadding: {
    ...shorthands.padding("12px"),
  },

  mediumPadding: {
    ...shorthands.padding("16px"),
  },

  largePadding: {
    ...shorthands.padding("20px"),
  },

  smallArrow: createArrowHeightStyles(arrowHeights.small),
  mediumLargeArrow: createArrowHeightStyles(arrowHeights.medium),
  arrow: createArrowStyles({ arrowHeight: undefined }),
});

export default (
  size: "small" | "medium" | "large",
  appearance?: "inverted" | "brand",
) =>
  defineStyles({
    root: [
      popoverSurfaceClassNames.root,
      styles.root,
      size === "small" && styles.smallPadding,
      size === "medium" && styles.mediumPadding,
      size === "large" && styles.largePadding,
      appearance === "inverted" && styles.inverted,
      appearance === "brand" && styles.brand,
    ],
    arrow: [
      styles.arrow,
      size === "small" ? styles.smallArrow : styles.mediumLargeArrow,
    ],
  });
