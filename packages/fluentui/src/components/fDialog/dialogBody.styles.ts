import { makeResetStyles, shorthands, mergeClasses } from "@refina/griffel";
import {
  DIALOG_GAP,
  SURFACE_PADDING,
  MEDIA_QUERY_BREAKPOINT_SELECTOR,
} from "./constants";

export const dialogBodyClassNames = {
  root: "fui-DialogBody",
} as const;

/**
 * Styles for the root slot
 */
const resetStyles = makeResetStyles({
  ...shorthands.overflow("unset"),
  ...shorthands.gap(DIALOG_GAP),
  display: "grid",
  maxHeight: `calc(100vh - 2 * ${SURFACE_PADDING})`,
  boxSizing: "border-box",
  gridTemplateRows: "auto 1fr",
  gridTemplateColumns: "1fr 1fr auto",

  [MEDIA_QUERY_BREAKPOINT_SELECTOR]: {
    maxWidth: "100vw",
    gridTemplateRows: "auto 1fr auto",
  },
});

export default {
  root: mergeClasses(dialogBodyClassNames.root, resetStyles),
};
