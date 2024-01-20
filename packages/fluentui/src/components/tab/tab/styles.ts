import { tokens, typographyStyles } from "@fluentui/tokens";
import { defineStyles, makeStyles, shorthands } from "@refina/griffel";
import { createCustomFocusIndicatorStyle } from "../../../focus";
import { activeIndicatorStyles as activeIndicatorStyles2 } from "../tabList/indicator.styles";

export const tabClassNames = {
  root: "fui-Tab",
  icon: "fui-Tab__icon",
  content: "fui-Tab__content",
} as const;

const reservedSpaceClassNames = {
  content: "fui-Tab__content--reserved-space",
} as const;

// These should match the constants defined in @fluentui/react-icons
// This package avoids taking a dependency on the icons package for only the constants.
const iconClassNames = {
  filled: "fui-Icon-filled",
  regular: "fui-Icon-regular",
} as const;

/**
 * Styles for the root slot
 */
const rootStyles = makeStyles({
  base: {
    alignItems: "center",
    ...shorthands.borderColor("none"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderWidth(0),
    cursor: "pointer",
    display: "grid",
    flexShrink: 0,
    gridAutoFlow: "column",
    gridTemplateColumns: "auto",
    gridTemplateRows: "auto",
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase300,
    outlineStyle: "none",
    position: "relative",
    ...shorthands.overflow("hidden"),
    textTransform: "none",
  },
  horizontal: {
    justifyContent: "center",
  },
  vertical: {
    justifyContent: "start",
  },
  smallHorizontal: {
    columnGap: tokens.spacingHorizontalXXS,
    ...shorthands.padding(
      tokens.spacingVerticalSNudge,
      tokens.spacingHorizontalSNudge,
    ),
  },
  smallVertical: {
    // horizontal spacing is deliberate. This is the gap between icon and content.
    columnGap: tokens.spacingHorizontalXXS,
    ...shorthands.padding(
      tokens.spacingVerticalXXS,
      tokens.spacingHorizontalSNudge,
    ),
  },
  mediumHorizontal: {
    columnGap: tokens.spacingHorizontalSNudge,
    ...shorthands.padding(
      tokens.spacingVerticalM,
      tokens.spacingHorizontalMNudge,
    ),
  },
  mediumVertical: {
    // horizontal spacing is deliberate. This is the gap between icon and content.
    columnGap: tokens.spacingHorizontalSNudge,
    ...shorthands.padding(
      tokens.spacingVerticalSNudge,
      tokens.spacingHorizontalMNudge,
    ),
  },
  largeHorizontal: {
    columnGap: tokens.spacingHorizontalSNudge,
    ...shorthands.padding(
      tokens.spacingVerticalL,
      tokens.spacingHorizontalMNudge,
    ),
  },
  largeVertical: {
    // horizontal spacing is deliberate. This is the gap between icon and content.
    columnGap: tokens.spacingHorizontalSNudge,
    ...shorthands.padding(
      tokens.spacingVerticalS,
      tokens.spacingHorizontalMNudge,
    ),
  },
  transparent: {
    backgroundColor: tokens.colorTransparentBackground,
    ":hover": {
      backgroundColor: tokens.colorTransparentBackgroundHover,
    },
    ":active": {
      backgroundColor: tokens.colorTransparentBackgroundPressed,
    },
    "& .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2,
    },
    ":hover .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2Hover,
    },
    ":active .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2Pressed,
    },
    "& .fui-Tab__content": {
      color: tokens.colorNeutralForeground2,
    },
    ":hover .fui-Tab__content": {
      color: tokens.colorNeutralForeground2Hover,
    },
    ":active .fui-Tab__content": {
      color: tokens.colorNeutralForeground2Pressed,
    },
  },
  subtle: {
    backgroundColor: tokens.colorSubtleBackground,
    ":hover": {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
    ":active": {
      backgroundColor: tokens.colorSubtleBackgroundPressed,
    },
    "& .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2,
    },
    ":hover .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2Hover,
    },
    ":active .fui-Tab__icon": {
      color: tokens.colorNeutralForeground2Pressed,
    },
    "& .fui-Tab__content": {
      color: tokens.colorNeutralForeground2,
    },
    ":hover .fui-Tab__content": {
      color: tokens.colorNeutralForeground2Hover,
    },
    ":active .fui-Tab__content": {
      color: tokens.colorNeutralForeground2Pressed,
    },
  },
  disabled: {
    backgroundColor: tokens.colorTransparentBackground,

    "& .fui-Tab__icon": {
      color: tokens.colorNeutralForegroundDisabled,
    },
    "& .fui-Tab__content": {
      color: tokens.colorNeutralForegroundDisabled,
    },
    cursor: "not-allowed",
  },
  selected: {
    "& .fui-Tab__icon": {
      color: tokens.colorCompoundBrandForeground1,
    },
    ":hover .fui-Tab__icon": {
      color: tokens.colorCompoundBrandForeground1Hover,
    },
    ":active .fui-Tab__icon": {
      color: tokens.colorCompoundBrandForeground1Pressed,
    },
    "& .fui-Tab__content": {
      color: tokens.colorNeutralForeground1,
    },
    ":hover .fui-Tab__content": {
      color: tokens.colorNeutralForeground1Hover,
    },
    ":active .fui-Tab__content": {
      color: tokens.colorNeutralForeground1Pressed,
    },
  },
});

/**
 * Focus styles for the root slot
 */
const focusStyles = makeStyles({
  // Tab creates a custom focus indicator because the default focus indicator
  // is applied using an ::after pseudo-element on the root. Since the selection
  // indicator uses an ::after pseudo-element on the root, there is a conflict.
  base: createCustomFocusIndicatorStyle(
    {
      ...shorthands.borderColor("transparent"),
      outlineWidth: tokens.strokeWidthThick,
      outlineColor: "transparent",
      outlineStyle: "solid",
      boxShadow: `
      ${tokens.shadow4},
      0 0 0 ${tokens.strokeWidthThick} ${tokens.colorStrokeFocus2}
    `,
      zIndex: 1,
    },
    { enableOutline: true },
  ),
});

/** Indicator styles for when pending selection */
const pendingIndicatorStyles = makeStyles({
  base: {
    ":hover::before": {
      backgroundColor: tokens.colorNeutralStroke1Hover,
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      content: '""',
      position: "absolute",
    },
    ":active::before": {
      backgroundColor: tokens.colorNeutralStroke1Pressed,
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      content: '""',
      position: "absolute",
    },
    "@media (forced-colors: active)": {
      ":hover::before": {
        backgroundColor: "Highlight",
      },
      ":active::before": {
        backgroundColor: "Highlight",
      },
    },
  },
  disabled: {
    ":hover::before": {
      backgroundColor: tokens.colorTransparentStroke,
    },
    ":active::before": {
      backgroundColor: tokens.colorTransparentStroke,
    },
  },
  smallHorizontal: {
    "::before": {
      bottom: 0,
      height: tokens.strokeWidthThick,
      left: tokens.spacingHorizontalSNudge,
      right: tokens.spacingHorizontalSNudge,
    },
  },
  smallVertical: {
    "::before": {
      bottom: tokens.spacingVerticalXS,
      left: 0,
      top: tokens.spacingVerticalXS,
      width: tokens.strokeWidthThicker,
    },
  },
  mediumHorizontal: {
    "::before": {
      bottom: 0,
      height: tokens.strokeWidthThicker,
      left: tokens.spacingHorizontalM,
      right: tokens.spacingHorizontalM,
    },
  },
  mediumVertical: {
    "::before": {
      bottom: tokens.spacingVerticalS,
      left: 0,
      top: tokens.spacingVerticalS,
      width: tokens.strokeWidthThicker,
    },
  },
  largeHorizontal: {
    "::before": {
      bottom: 0,
      height: tokens.strokeWidthThicker,
      left: tokens.spacingHorizontalM,
      right: tokens.spacingHorizontalM,
    },
  },
  largeVertical: {
    "::before": {
      bottom: tokens.spacingVerticalMNudge,
      left: 0,
      top: tokens.spacingVerticalMNudge,
      width: tokens.strokeWidthThicker,
    },
  },
});

const activeIndicatorStyles = makeStyles({
  base: {
    "::after": {
      backgroundColor: tokens.colorTransparentStroke,
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      content: '""',
      position: "absolute",
      zIndex: 1,
    },
  },
  selected: {
    "::after": {
      backgroundColor: tokens.colorCompoundBrandStroke,
    },
    ":hover::after": {
      backgroundColor: tokens.colorCompoundBrandStrokeHover,
    },
    ":active::after": {
      backgroundColor: tokens.colorCompoundBrandStrokePressed,
    },
    "@media (forced-colors: active)": {
      "::after": {
        backgroundColor: "ButtonText",
      },
      ":hover::after": {
        backgroundColor: "ButtonText",
      },
      ":active::after": {
        backgroundColor: "ButtonText",
      },
    },
  },
  disabled: {
    "::after": {
      backgroundColor: tokens.colorNeutralForegroundDisabled,
    },
  },
  smallHorizontal: {
    "::after": {
      bottom: 0,
      height: tokens.strokeWidthThick,
      left: tokens.spacingHorizontalSNudge,
      right: tokens.spacingHorizontalSNudge,
    },
  },
  smallVertical: {
    "::after": {
      bottom: tokens.spacingVerticalXS,
      left: "0",
      top: tokens.spacingVerticalXS,
      width: tokens.strokeWidthThicker,
    },
  },
  mediumHorizontal: {
    "::after": {
      bottom: "0",
      height: tokens.strokeWidthThicker,
      left: tokens.spacingHorizontalM,
      right: tokens.spacingHorizontalM,
    },
  },
  mediumVertical: {
    "::after": {
      bottom: tokens.spacingVerticalS,
      left: 0,
      top: tokens.spacingVerticalS,
      width: tokens.strokeWidthThicker,
    },
  },
  largeHorizontal: {
    "::after": {
      bottom: 0,
      height: tokens.strokeWidthThicker,
      left: tokens.spacingHorizontalM,
      right: tokens.spacingHorizontalM,
    },
  },
  largeVertical: {
    "::after": {
      bottom: tokens.spacingVerticalMNudge,
      left: 0,
      top: tokens.spacingVerticalMNudge,
      width: tokens.strokeWidthThicker,
    },
  },
});

/**
 * Styles for the icon slot.
 */
const iconStyles = makeStyles({
  base: {
    gridColumnStart: 1,
    gridRowStart: 1,
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    ...shorthands.overflow("hidden"),
    [`& .${iconClassNames.filled}`]: {
      display: "none",
    },
    [`& .${iconClassNames.regular}`]: {
      display: "inline",
    },
  },
  // per design, the small and medium font sizes are the same.
  // the size prop only affects spacing.
  small: {
    fontSize: "20px",
    height: "20px",
    width: "20px",
  },
  medium: {
    fontSize: "20px",
    height: "20px",
    width: "20px",
  },
  large: {
    fontSize: "24px",
    height: "24px",
    width: "24px",
  },
  selected: {
    [`& .${iconClassNames.filled}`]: {
      display: "inline",
    },
    [`& .${iconClassNames.regular}`]: {
      display: "none",
    },
  },
});

/**
 * Styles for the content slot (children)
 */
const contentStyles = makeStyles({
  base: {
    ...typographyStyles.body1,
    ...shorthands.overflow("hidden"),
    // content padding is the same for medium & small, horiztonal & vertical
    ...shorthands.padding(
      tokens.spacingVerticalNone,
      tokens.spacingHorizontalXXS,
    ),
  },
  selected: {
    ...typographyStyles.body1Strong,
  },
  large: {
    ...typographyStyles.body2,
  },
  largeSelected: {
    ...typographyStyles.subtitle2,
  },
  noIconBefore: {
    gridColumnStart: 1,
    gridRowStart: 1,
  },
  iconBefore: {
    gridColumnStart: 2,
    gridRowStart: 1,
  },
  placeholder: {
    visibility: "hidden",
  },
});

/**
 * Apply styling to the Tab slots based on the state
 */
export default (
  disabled: boolean,
  selected: boolean,
  animating: boolean,
  vertical: boolean,
  hasIcon: boolean,
) =>
  defineStyles({
    root: [
      tabClassNames.root,
      rootStyles.base,
      vertical ? rootStyles.vertical : rootStyles.horizontal,
      vertical ? rootStyles.mediumVertical : rootStyles.mediumHorizontal,
      focusStyles.base,
      !disabled && rootStyles.transparent,
      !disabled && selected && rootStyles.selected,
      disabled && rootStyles.disabled,

      // pending indicator (before pseudo element)
      pendingIndicatorStyles.base,
      vertical
        ? pendingIndicatorStyles.mediumVertical
        : pendingIndicatorStyles.mediumHorizontal,
      disabled && pendingIndicatorStyles.disabled,

      // active indicator (after pseudo element)
      selected && activeIndicatorStyles.base,
      selected && !disabled && activeIndicatorStyles.selected,
      selected &&
        (vertical
          ? activeIndicatorStyles.mediumVertical
          : activeIndicatorStyles.mediumHorizontal),
      selected && disabled && activeIndicatorStyles.disabled,

      // animatedIndicator part
      ...(disabled
        ? []
        : [
            selected && activeIndicatorStyles2.base,
            selected && animating && activeIndicatorStyles2.animated,
            selected &&
              (vertical
                ? activeIndicatorStyles2.vertical
                : activeIndicatorStyles2.horizontal),
          ]),
    ],

    icon: [
      tabClassNames.icon,
      iconStyles.base,
      iconStyles.medium,
      selected && iconStyles.selected,
    ],

    // This needs to be before content.className is updated
    contentReservedSpace: [
      reservedSpaceClassNames.content,
      contentStyles.base,
      hasIcon ? contentStyles.iconBefore : contentStyles.noIconBefore,
      contentStyles.placeholder,
    ],

    // FIXME: this is a deprecated API
    // should be removed in the next major version
    // eslint-disable-next-line deprecation/deprecation
    //contentReservedSpaceClassName = contentReservedSpace.className,

    content: [
      tabClassNames.content,
      contentStyles.base,
      selected && contentStyles.selected,
      hasIcon ? contentStyles.iconBefore : contentStyles.noIconBefore,
    ],

    // useTabAnimatedIndicatorStyles_unstable(state);
  });
