import { typographyStyles } from "@fluentui/tokens";
import {
  makeResetStyles,
  shorthands,
  makeStyles,
  mergeClasses,
} from "@refina/griffel";
import { createFocusOutlineStyle } from "../../focus";

export const dialogTitleClassNames = {
  root: "fui-DialogTitle",
  action: "fui-DialogTitle__action",
} as const;

/**
 * Styles for the root slot
 */
const rootResetStyles = makeResetStyles({
  ...typographyStyles.subtitle1,
  ...shorthands.margin(0),
  gridRowStart: 1,
  gridRowEnd: 1,
  gridColumnStart: 1,
  gridColumnEnd: 3,
});

const styles = makeStyles({
  rootWithoutAction: {
    gridColumnEnd: 4,
  },
});

/**
 * Styles for the action slot
 */
const actionResetStyles = makeResetStyles({
  gridRowStart: 1,
  gridRowEnd: 1,
  gridColumnStart: 3,
  justifySelf: "end",
  alignSelf: "start",
});

/**
 * Styles to be applied on internal elements used by default action on non-modal Dialog
 * @internal
 */
export const dialogTitleInternalStyles = makeResetStyles({
  ...createFocusOutlineStyle(),
  ...shorthands.overflow("visible"),
  ...shorthands.padding(0),
  ...shorthands.borderStyle("none"),
  position: "relative",
  boxSizing: "content-box",
  backgroundColor: "inherit",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  cursor: "pointer",
  lineHeight: 0,
  WebkitAppearance: "button",
  textAlign: "unset",
});

export default {
  root: (withoutAction: boolean) =>
    mergeClasses(
      dialogTitleClassNames.root,
      rootResetStyles,
      withoutAction && styles.rootWithoutAction,
    ),
  action: mergeClasses(dialogTitleClassNames.action, actionResetStyles),
  closeButton: mergeClasses(dialogTitleInternalStyles),
};
