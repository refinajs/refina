import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import {
  buttonClassNames,
  iconFilledClassName,
  iconRegularClassName,
} from "../button/styles";

/**
 * Static CSS class names used internally for the component slots.
 */
export const breadcrumbButtonClassNames = {
  root: "fui-BreadcrumbButton",
  icon: "fui-BreadcrumbButton__icon",
};

/**
 * CSS variable names used internally for styling in the Breadcrumb.
 */
const breadcrumbCSSVars = {
  breadcrumbIconSizeVar: "--fui-Breadcrumb--icon-size",
  breadcrumbIconLineHeightVar: "--fui-Breadcrumb--icon-line-height",
};

const iconStyles = makeStyles({
  base: {
    fontSize: `var(${breadcrumbCSSVars.breadcrumbIconSizeVar})`,
    height: `var(${breadcrumbCSSVars.breadcrumbIconSizeVar})`,
    lineHeight: `var(${breadcrumbCSSVars.breadcrumbIconLineHeightVar})`,
    width: `var(${breadcrumbCSSVars.breadcrumbIconSizeVar})`,
    marginRight: tokens.spacingHorizontalXS,
  },
  small: {
    [breadcrumbCSSVars.breadcrumbIconSizeVar]: "12px",
    [breadcrumbCSSVars.breadcrumbIconLineHeightVar]: tokens.lineHeightBase200,
  },
  medium: {
    [breadcrumbCSSVars.breadcrumbIconSizeVar]: "16px",
    [breadcrumbCSSVars.breadcrumbIconLineHeightVar]: tokens.lineHeightBase400,
  },
  large: {
    [breadcrumbCSSVars.breadcrumbIconSizeVar]: "20px",
    [breadcrumbCSSVars.breadcrumbIconLineHeightVar]: tokens.lineHeightBase600,
  },
});

const defaultButtonStyles = {
  backgroundColor: tokens.colorTransparentBackground,
  color: tokens.colorNeutralForeground2,
  cursor: "auto",
};

const currentIconStyles = {
  ...defaultButtonStyles,
  [`& .${buttonClassNames.icon}`]: {
    color: "unset",
  },
  [`& .${iconFilledClassName}`]: {
    display: "none",
  },
  [`& .${iconRegularClassName}`]: {
    display: "inline",
  },
};

const styles = makeStyles({
  root: {
    minWidth: "unset",
    textWrap: "nowrap",
  },
  small: {
    height: "24px",
    ...typographyStyles.caption1,
    ...shorthands.padding(tokens.spacingHorizontalSNudge),
  },
  medium: {
    height: "32px",
    ...typographyStyles.body1,
    ...shorthands.padding(tokens.spacingHorizontalSNudge),
  },
  large: {
    height: "40px",
    ...typographyStyles.body2,
    ...shorthands.padding(tokens.spacingHorizontalS),
  },
  current: {
    ":hover": {
      ...currentIconStyles,
    },
    ":hover:active": {
      ...currentIconStyles,
    },
    ":disabled": {
      ...currentIconStyles,
    },
  },
  currentSmall: {
    ...typographyStyles.caption1Strong,
  },
  currentMedium: {
    ...typographyStyles.body1Strong,
  },
  currentLarge: {
    ...typographyStyles.subtitle2,
  },
});

export default (current: boolean) =>
  defineStyles({
    root: [
      breadcrumbButtonClassNames.root,
      styles.medium,
      styles.root,
      current && styles.currentMedium,
      current && styles.current,
    ],
    icon: [iconStyles.base, iconStyles.medium],
  });
