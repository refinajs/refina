import { tokens } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";

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

export default () =>
  defineStyles({
    root: [accordionPanelClassNames.root, styles.root],
  });
