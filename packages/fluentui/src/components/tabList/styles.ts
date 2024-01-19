import { makeStyles, mergeClasses } from "@refina/griffel";

export const tabListClassNames = {
  root: "fui-TabList",
} as const;

/**
 * Styles for the root slot
 */
const styles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    flexWrap: "nowrap",
    position: "relative",
  },
  horizontal: {
    alignItems: "stretch",
    flexDirection: "row",
  },
  vertical: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});

/**
 * Apply styling to the TabList slots based on the state
 */
export default {
  root: (vertical: boolean) =>
    mergeClasses(
      tabListClassNames.root,
      styles.root,
      vertical ? styles.vertical : styles.horizontal,
    ),
};
