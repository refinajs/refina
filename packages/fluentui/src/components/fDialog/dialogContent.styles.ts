import { tokens, typographyStyles } from "@fluentui/tokens";
import { makeResetStyles, shorthands, mergeClasses } from "@refina/griffel";

export const dialogContentClassNames = {
  root: "fui-DialogContent",
} as const;

/**
 * Styles for the root slot
 */
const styles = makeResetStyles({
  ...shorthands.padding(tokens.strokeWidthThick),
  ...shorthands.margin(`calc(${tokens.strokeWidthThick} * -1)`),
  ...typographyStyles.body1,
  overflowY: "auto",
  minHeight: "32px",
  boxSizing: "border-box",
  gridRowStart: 2,
  gridRowEnd: 2,
  gridColumnStart: 1,
  gridColumnEnd: 4,
});

export default {
  root: mergeClasses(dialogContentClassNames.root, styles),
};
