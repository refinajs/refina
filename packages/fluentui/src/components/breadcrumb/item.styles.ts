import { tokens } from "@fluentui/tokens";
import { defineStyles, makeResetStyles } from "@refina/griffel";

export const breadcrumbItemClassNames = {
  root: "fui-BreadcrumbItem",
};

const breadcrumbItemResetStyles = makeResetStyles({
  display: "flex",
  alignItems: "center",
  color: tokens.colorNeutralForeground2,
  boxSizing: "border-box",
  textWrap: "nowrap",
});

export default () =>
  defineStyles({
    root: [breadcrumbItemClassNames.root, breadcrumbItemResetStyles],
  });
