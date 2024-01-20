import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeResetStyles, makeStyles } from "@refina/griffel";
import { FFieldValidationState } from "./types";

export const fieldClassNames = {
  root: `fui-Field`,
  label: `fui-Field__label`,
  validationMessage: `fui-Field__validationMessage`,
  validationMessageIcon: `fui-Field__validationMessageIcon`,
  hint: `fui-Field__hint`,
} as const;

// Size of the icon in the validation message
const iconSize = "12px";

/**
 * Styles for the root slot
 */
const rootStyles = makeStyles({
  base: {
    display: "grid",
  },

  // In horizontal layout, the field is a grid with the label taking up the entire first column.
  // The last row is slack space in case the label is taller than the rest of the content.
  horizontal: {
    gridTemplateColumns: "33% 1fr",
    gridTemplateRows: "auto auto auto 1fr",
  },

  // In horizontal layout without a label, replace the label's column with padding.
  // This lets grid auto-flow properly place the other children, and keeps fields with and without labels aligned.
  horizontalNoLabel: {
    paddingLeft: "33%",
    gridTemplateColumns: "1fr",
  },
});

const labelStyles = makeStyles({
  base: {
    paddingTop: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXXS,
  },

  large: {
    paddingTop: "1px",
    paddingBottom: "1px",
  },

  vertical: {
    marginBottom: tokens.spacingVerticalXXS,
  },

  verticalLarge: {
    marginBottom: tokens.spacingVerticalXS,
  },

  horizontal: {
    marginRight: tokens.spacingHorizontalM,
    gridRowStart: "1",
    gridRowEnd: "-1",
  },
});

const secondaryTextBaseClassName = makeResetStyles({
  marginTop: tokens.spacingVerticalXXS,
  color: tokens.colorNeutralForeground3,
  ...typographyStyles.caption1,
});

const secondaryTextStyles = makeStyles({
  error: {
    color: tokens.colorPaletteRedForeground1,
  },

  withIcon: {
    // Add a gutter for the icon, to allow multiple lines of text to line up to the right of the icon.
    paddingLeft: `calc(${iconSize} + ${tokens.spacingHorizontalXS})`,
  },
});

const validationMessageIconBaseClassName = makeResetStyles({
  display: "inline-block",
  fontSize: iconSize,
  // Negative left margin puts the icon in the gutter of the validation message div's withIcon style.
  marginLeft: `calc(-${iconSize} - ${tokens.spacingHorizontalXS})`,
  marginRight: tokens.spacingHorizontalXS,
  // Line height of 0 prevents the verticalAlign from affecting the line height of the text.
  lineHeight: "0",
  // Negative verticalAlign shifts the inline icon down to align with the text (effectively top padding).
  verticalAlign: "-1px",
});

const validationMessageIconStyles = makeStyles({
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
  warning: {
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
  success: {
    color: tokens.colorPaletteGreenForeground1,
  },
});

export default (
  validationState: FFieldValidationState,
  isError: boolean,
  hasIcon: boolean,
) =>
  defineStyles({
    root: [fieldClassNames.root, rootStyles.base],
    label: [fieldClassNames.label, labelStyles.base, labelStyles.vertical],
    validationMessageIcon: [
      fieldClassNames.validationMessageIcon,
      validationMessageIconBaseClassName,
      validationState !== "none" &&
        validationMessageIconStyles[validationState],
    ],
    validationMessage: [
      fieldClassNames.validationMessage,
      secondaryTextBaseClassName,
      isError && secondaryTextStyles.error,
      hasIcon && secondaryTextStyles.withIcon,
    ],
    hint: [fieldClassNames.hint, secondaryTextBaseClassName],
  });
