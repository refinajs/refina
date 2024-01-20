import { defineStyles, makeStyles } from "@refina/griffel";

export const breadcrumbDividerClassNames = {
  root: "fui-BreadcrumbDivider",
};

/**
 * Styles for the root slot
 */
const styles = makeStyles({
  root: {
    display: "flex",
  },
});

export default () =>
  defineStyles({
    root: [breadcrumbDividerClassNames.root, styles.root],
  });
