/**
 * WARNING: This style file is non-standard.
 * Copied from https://react.fluentui.dev/?path=/docs/components-tablist--default#with-panels
 */
import { makeStyles, mergeClasses, shorthands } from "@refina/griffel";

const styles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("50px", "20px"),
    rowGap: "20px",
  },
  panels: {
    ...shorthands.padding(0, "10px"),
    "& th": {
      textAlign: "left",
      ...shorthands.padding(0, "30px", 0, 0),
    },
  },
});

export default {
  root: mergeClasses(styles.root),
  panels: mergeClasses(styles.panels),
};
