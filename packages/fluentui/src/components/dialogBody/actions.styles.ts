import {
  defineStyles,
  makeResetStyles,
  makeStyles,
  shorthands,
} from "@refina/griffel";
import { DIALOG_GAP, MEDIA_QUERY_BREAKPOINT_SELECTOR } from "./constants";

export const dialogActionsClassNames = {
  root: "fui-DialogActions",
} as const;

/**
 * Styles for the root slot
 */
const resetStyles = makeResetStyles({
  ...shorthands.gap(DIALOG_GAP),
  height: "fit-content",
  boxSizing: "border-box",
  display: "flex",
  gridRowStart: 3,
  gridRowEnd: 3,
  [MEDIA_QUERY_BREAKPOINT_SELECTOR]: {
    flexDirection: "column",
    justifySelf: "stretch",
  },
});

const styles = makeStyles({
  gridPositionEnd: {
    justifySelf: "end",
    gridColumnStart: 2,
    gridColumnEnd: 4,
    [MEDIA_QUERY_BREAKPOINT_SELECTOR]: {
      gridColumnStart: 1,
      gridRowStart: 4,
      gridRowEnd: "auto",
    },
  },
  gridPositionStart: {
    justifySelf: "start",
    gridColumnStart: 1,
    gridColumnEnd: 2,
    [MEDIA_QUERY_BREAKPOINT_SELECTOR]: {
      gridColumnEnd: 4,
      gridRowStart: 3,
      gridRowEnd: "auto",
    },
  },
  fluidStart: {
    gridColumnEnd: 4,
  },
  fluidEnd: {
    gridColumnStart: 1,
  },
});

export default (fluid: boolean, position: "start" | "end") =>
  defineStyles({
    root: [
      dialogActionsClassNames.root,
      resetStyles,
      position === "start" && styles.gridPositionStart,
      position === "end" && styles.gridPositionEnd,
      fluid && position === "start" && styles.fluidStart,
      fluid && position === "end" && styles.fluidEnd,
    ],
  });
