import { tokens } from "@fluentui/tokens";
import {
  makeResetStyles,
  shorthands,
  makeStyles,
  mergeClasses,
} from "@refina/griffel";
import { createFocusOutlineStyle } from "../../focus";
import {
  SURFACE_PADDING,
  SURFACE_BORDER_WIDTH,
  MEDIA_QUERY_BREAKPOINT_SELECTOR,
} from "./constants";

export const dialogSurfaceClassNames = {
  root: "fui-DialogSurface",
  backdrop: "fui-DialogSurface__backdrop",
} as const;

/**
 * Styles for the root slot
 */
const surfaceResetStyles = makeResetStyles({
  ...createFocusOutlineStyle(),
  ...shorthands.inset(0),
  ...shorthands.padding(0),
  ...shorthands.padding(SURFACE_PADDING),
  ...shorthands.margin("auto"),
  ...shorthands.borderStyle("none"),
  ...shorthands.overflow("unset"),
  ...shorthands.border(
    SURFACE_BORDER_WIDTH,
    "solid",
    tokens.colorTransparentStroke,
  ),
  ...shorthands.borderRadius(tokens.borderRadiusXLarge),

  contain: "content",
  display: "block",
  userSelect: "unset",
  visibility: "unset",
  position: "fixed",
  height: "fit-content",
  maxWidth: "600px",
  maxHeight: "100vh",
  boxSizing: "border-box",
  boxShadow: tokens.shadow64,
  backgroundColor: tokens.colorNeutralBackground1,
  color: tokens.colorNeutralForeground1,

  [MEDIA_QUERY_BREAKPOINT_SELECTOR]: {
    maxWidth: "100vw",
  },
});

const backdropStyles = makeStyles({
  nestedDialogBackdrop: {
    backgroundColor: "transparent",
  },
});

/**
 * Styles for the backdrop slot
 */
const backdropResetStyles = makeResetStyles({
  ...shorthands.inset("0px"),
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  position: "fixed",
});

export default {
  root: mergeClasses(dialogSurfaceClassNames.root, surfaceResetStyles),
  backdrop: (isNestedDialog: boolean) =>
    mergeClasses(
      dialogSurfaceClassNames.backdrop,
      backdropResetStyles,
      isNestedDialog && backdropStyles.nestedDialogBackdrop,
    ),
};
