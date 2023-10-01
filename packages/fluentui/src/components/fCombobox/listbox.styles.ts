import { tokens } from "@fluentui/tokens";
import { makeStyles, shorthands, mergeClasses } from "@refina/griffel";

export const listboxClassNames = {
  root: "fui-Listbox",
} as const;

const styles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
    overflowY: "auto",
    ...shorthands.outline("1px", "solid", tokens.colorTransparentStroke),
    ...shorthands.padding(tokens.spacingHorizontalXS),
    rowGap: tokens.spacingHorizontalXXS,
  },
});

export default {
  root: mergeClasses(listboxClassNames.root, styles.root),
};
