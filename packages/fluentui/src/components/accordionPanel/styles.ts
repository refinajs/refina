import { tokens } from "@fluentui/tokens";
import { makeStyles, shorthands, mergeClasses } from "@refina/griffel";

export const accordionPanelClassNames = {
  root: "fui-AccordionPanel",
} as const;

/**
 * Styles for the root slot
 */
const styles = makeStyles({
  root: {
    ...shorthands.margin(0, tokens.spacingHorizontalM),
  },
});

export default {
  root: mergeClasses(accordionPanelClassNames.root, styles.root),
};
