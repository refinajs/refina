import { defineStyles } from "@refina/griffel";

export const accordionItemClassNames = {
  root: "fui-AccordionItem",
} as const;

export default () =>
  defineStyles({
    root: [accordionItemClassNames.root],
  });
