import { defineStyles, makeResetStyles } from "@refina/griffel";

export const breadcrumbClassNames = {
  root: "fui-Breadcrumb",
  list: "fui-Breadcrumb__list",
};

const listClassName = makeResetStyles({
  listStyleType: "none",
  display: "flex",
  alignItems: "center",
  margin: 0,
  padding: 0,
});

export default () =>
  defineStyles({
    root: [breadcrumbClassNames.root],
    list: [listClassName, breadcrumbClassNames.list],
  });
