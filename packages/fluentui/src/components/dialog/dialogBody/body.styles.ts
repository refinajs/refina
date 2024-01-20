import { defineStyles, makeResetStyles, shorthands } from "@refina/griffel";
import {
  DIALOG_GAP,
  MEDIA_QUERY_BREAKPOINT_SELECTOR,
  SURFACE_PADDING,
} from "../constants";

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

export default () =>
  defineStyles({
    root: [dialogBodyClassNames.root, resetStyles],
  });
