import { mergeClasses } from "@refina/griffel";

export const accordionItemClassNames = {
  root: "fui-AccordionItem",
} as const;

export default {
  root: mergeClasses(accordionItemClassNames.root),
};
