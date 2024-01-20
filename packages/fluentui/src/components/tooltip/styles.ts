import { tokens } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import { createArrowStyles } from "../../positioning";
import { arrowHeight } from "./constants";

export const tooltipClassNames = {
  content: "fui-Tooltip__content",
} as const;

/**
 * Styles for the tooltip
 */
const styles = makeStyles({
  root: {
    display: "none",
    boxSizing: "border-box",
    maxWidth: "240px",
    cursor: "default",
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    overflowWrap: "break-word",

    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorTransparentStroke),
    ...shorthands.padding("4px", "11px", "6px", "11px"), // '5px 12px 7px 12px' minus the border width '1px'
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,

    // TODO need to add versions of tokens.alias.shadow.shadow8, etc. that work with filter
    filter:
      `drop-shadow(0 0 2px ${tokens.colorNeutralShadowAmbient}) ` +
      `drop-shadow(0 4px 8px ${tokens.colorNeutralShadowKey})`,
  },

  visible: {
    display: "block",
  },

  inverted: {
    backgroundColor: tokens.colorNeutralBackgroundStatic,
    color: tokens.colorNeutralForegroundStaticInverted,
  },

  arrow: createArrowStyles({ arrowHeight }),
});

export default (visible: boolean) =>
  defineStyles({
    content: [
      tooltipClassNames.content,
      styles.root,
      visible && styles.visible,
    ],
    arrowClassName: [styles.arrow],
  });
