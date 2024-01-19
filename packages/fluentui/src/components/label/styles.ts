import { tokens } from "@fluentui/tokens";
import { makeStyles, mergeClasses } from "@refina/griffel";

export const labelClassNames = {
  root: "fui-Label",
  required: "fui-Label__required",
} as const;

const styles = makeStyles({
  root: {
    fontFamily: tokens.fontFamilyBase,
    color: tokens.colorNeutralForeground1,
  },

  disabled: {
    color: tokens.colorNeutralForegroundDisabled,
  },

  required: {
    color: tokens.colorPaletteRedForeground3,
    paddingLeft: "4px", // TODO: Once spacing tokens are added, change this to Horizontal XS
  },

  requiredDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
  },

  small: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },

  medium: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },

  large: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
  },

  semibold: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

export default {
  root: (disabled: boolean) =>
    mergeClasses(
      labelClassNames.root,
      styles.root,
      disabled && styles.disabled,
      styles.medium,
    ),
  required: (disabled: boolean) =>
    mergeClasses(
      labelClassNames.required,
      styles.required,
      disabled && styles.requiredDisabled,
    ),
};
