import { tokens } from "@fluentui/tokens";
import {
  defineStyles,
  makeResetStyles,
  makeStyles,
  shorthands,
} from "@refina/griffel";
import { FAvatarActive, FAvatarNamedColor, FAvatarShape } from "./types";

export const avatarClassNames = {
  root: "fui-Avatar",
  image: "fui-Avatar__image",
  initials: "fui-Avatar__initials",
  icon: "fui-Avatar__icon",
  badge: "fui-Avatar__badge",
};

// CSS variables used internally in Avatar's styles
const vars = {
  badgeRadius: "--fui-Avatar-badgeRadius",
  badgeGap: "--fui-Avatar-badgeGap",
  badgeAlign: "--fui-Avatar-badgeAlign",
  ringWidth: "--fui-Avatar-ringWidth",
};

const rootClassName = makeResetStyles({
  display: "inline-block",
  flexShrink: 0,
  position: "relative",
  verticalAlign: "middle",
  borderRadius: tokens.borderRadiusCircular,
  fontFamily: tokens.fontFamilyBase,
  fontWeight: tokens.fontWeightSemibold,
  fontSize: tokens.fontSizeBase300,
  width: "32px",
  height: "32px",

  // ::before is the ring, and ::after is the shadow.
  // These are not displayed by default; the ring and shadow clases set content: "" to display them when appropriate.
  "::before,::after": {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
    margin: `calc(-2 * var(${vars.ringWidth}, 0px))`,
    borderRadius: "inherit",
    transitionProperty: "margin, opacity",
    transitionTimingFunction: `${tokens.curveEasyEaseMax}, ${tokens.curveLinear}`,
    transitionDuration: `${tokens.durationUltraSlow}, ${tokens.durationSlower}`,
    "@media screen and (prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
    },
  },
  "::before": {
    borderStyle: "solid",
    borderWidth: `var(${vars.ringWidth})`,
  },
});

const imageClassName = makeResetStyles({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",

  borderRadius: "inherit",
  objectFit: "cover",
  verticalAlign: "top",
});

const iconInitialsClassName = makeResetStyles({
  position: "absolute",
  boxSizing: "border-box",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  lineHeight: "1",
  border: `${tokens.strokeWidthThin} solid ${tokens.colorTransparentStroke}`,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "center",
  textAlign: "center",
  userSelect: "none",
  borderRadius: "inherit",
});

/**
 * Helper to create a maskImage that punches out a circle larger than the badge by `badgeGap`.
 * This creates a transparent gap between the badge and Avatar.
 *
 * Used by the icon, initials, and image slots, as well as the ring ::before pseudo-element.
 */
const badgeMask = (margin?: string) => {
  // Center the cutout at the badge's radius away from the edge.
  // The ring (::before) also has a 2 * ringWidth margin that also needs to be offset.
  const centerOffset = margin
    ? `calc(var(${vars.badgeRadius}) + ${margin})`
    : `var(${vars.badgeRadius})`;
  // radial-gradient does not have anti-aliasing, so the transparent and opaque gradient stops are offset by +/- 0.25px
  // to "fade" from transparent to opaque over a half-pixel and ease the transition.
  const innerRadius = `calc(var(${vars.badgeRadius}) + var(${vars.badgeGap}) - 0.25px)`;
  const outerRadius = `calc(var(${vars.badgeRadius}) + var(${vars.badgeGap}) + 0.25px)`;

  return (
    `radial-gradient(circle at bottom ${centerOffset} var(${vars.badgeAlign}) ${centerOffset}, ` +
    `transparent ${innerRadius}, white ${outerRadius})`
  );
};

const styles = makeStyles({
  textCaption2Strong: { fontSize: tokens.fontSizeBase100 },
  textCaption1Strong: { fontSize: tokens.fontSizeBase200 },
  textSubtitle2: { fontSize: tokens.fontSizeBase400 },
  textSubtitle1: { fontSize: tokens.fontSizeBase500 },
  textTitle3: { fontSize: tokens.fontSizeBase600 },

  squareSmall: {
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },
  squareMedium: {
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  squareLarge: {
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  squareXLarge: {
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },

  activeOrInactive: {
    transform: "perspective(1px)", // Work-around for text pixel snapping at the end of the animation
    transitionProperty: "transform, opacity",
    transitionDuration: `${tokens.durationUltraSlow}, ${tokens.durationFaster}`,
    transitionTimingFunction: `${tokens.curveEasyEaseMax}, ${tokens.curveLinear}`,

    "@media screen and (prefers-reduced-motion: reduce)": {
      transitionDuration: "0.01ms",
    },
  },

  ring: {
    // Show the ::before pseudo-element, which is the ring
    "::before": { content: '""' },
  },
  ringBadgeCutout: {
    "::before": {
      maskImage: badgeMask(/*margin =*/ `2 * var(${vars.ringWidth})`),
    },
  },
  ringThick: {
    [vars.ringWidth]: tokens.strokeWidthThick,
  },
  ringThicker: {
    [vars.ringWidth]: tokens.strokeWidthThicker,
  },
  ringThickest: {
    [vars.ringWidth]: tokens.strokeWidthThickest,
  },

  shadow: {
    // Show the ::after pseudo-element, which is the shadow
    "::after": { content: '""' },
  },
  shadow4: {
    "::after": { boxShadow: tokens.shadow4 },
  },
  shadow8: {
    "::after": { boxShadow: tokens.shadow8 },
  },
  shadow16: {
    "::after": { boxShadow: tokens.shadow16 },
  },
  shadow28: {
    "::after": { boxShadow: tokens.shadow28 },
  },

  inactive: {
    opacity: "0.8",
    transform: "scale(0.875)",
    transitionTimingFunction: `${tokens.curveDecelerateMin}, ${tokens.curveLinear}`,

    "::before,::after": {
      ...shorthands.margin(0),
      opacity: 0,
      transitionTimingFunction: `${tokens.curveDecelerateMin}, ${tokens.curveLinear}`,
    },
  },

  // Applied to the badge slot
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  // Applied to the image, initials, or icon slot when there is a badge
  badgeCutout: {
    maskImage: badgeMask(),
  },

  // Applied to the root when there is a badge
  badgeAlign: {
    // Griffel won't auto-flip the "right" alignment to "left" in RTL if it is inline in the maskImage,
    // so split it out into a css variable that will auto-flip.
    [vars.badgeAlign]: "right",
  },

  // Badge size: applied to root when there is a badge
  tiny: {
    [vars.badgeRadius]: "3px",
    [vars.badgeGap]: tokens.strokeWidthThin,
  },
  "extra-small": {
    [vars.badgeRadius]: "5px",
    [vars.badgeGap]: tokens.strokeWidthThin,
  },
  small: {
    [vars.badgeRadius]: "6px",
    [vars.badgeGap]: tokens.strokeWidthThin,
  },
  medium: {
    [vars.badgeRadius]: "8px",
    [vars.badgeGap]: tokens.strokeWidthThin,
  },
  large: {
    [vars.badgeRadius]: "10px",
    [vars.badgeGap]: tokens.strokeWidthThick,
  },
  "extra-large": {
    [vars.badgeRadius]: "14px",
    [vars.badgeGap]: tokens.strokeWidthThick,
  },

  icon12: { fontSize: "12px" },
  icon16: { fontSize: "16px" },
  icon20: { fontSize: "20px" },
  icon24: { fontSize: "24px" },
  icon28: { fontSize: "28px" },
  icon32: { fontSize: "32px" },
  icon48: { fontSize: "48px" },
});

export const useSizeStyles = makeStyles({
  16: { width: "16px", height: "16px" },
  20: { width: "20px", height: "20px" },
  24: { width: "24px", height: "24px" },
  28: { width: "28px", height: "28px" },
  32: { width: "32px", height: "32px" },
  36: { width: "36px", height: "36px" },
  40: { width: "40px", height: "40px" },
  48: { width: "48px", height: "48px" },
  56: { width: "56px", height: "56px" },
  64: { width: "64px", height: "64px" },
  72: { width: "72px", height: "72px" },
  96: { width: "96px", height: "96px" },
  120: { width: "120px", height: "120px" },
  128: { width: "128px", height: "128px" },
});

const colorStyles = makeStyles({
  neutral: {
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground6,
  },
  brand: {
    color: tokens.colorNeutralForegroundStaticInverted,
    backgroundColor: tokens.colorBrandBackgroundStatic,
  },
  "dark-red": {
    color: tokens.colorPaletteDarkRedForeground2,
    backgroundColor: tokens.colorPaletteDarkRedBackground2,
  },
  cranberry: {
    color: tokens.colorPaletteCranberryForeground2,
    backgroundColor: tokens.colorPaletteCranberryBackground2,
  },
  red: {
    color: tokens.colorPaletteRedForeground2,
    backgroundColor: tokens.colorPaletteRedBackground2,
  },
  pumpkin: {
    color: tokens.colorPalettePumpkinForeground2,
    backgroundColor: tokens.colorPalettePumpkinBackground2,
  },
  peach: {
    color: tokens.colorPalettePeachForeground2,
    backgroundColor: tokens.colorPalettePeachBackground2,
  },
  marigold: {
    color: tokens.colorPaletteMarigoldForeground2,
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
  },
  gold: {
    color: tokens.colorPaletteGoldForeground2,
    backgroundColor: tokens.colorPaletteGoldBackground2,
  },
  brass: {
    color: tokens.colorPaletteBrassForeground2,
    backgroundColor: tokens.colorPaletteBrassBackground2,
  },
  brown: {
    color: tokens.colorPaletteBrownForeground2,
    backgroundColor: tokens.colorPaletteBrownBackground2,
  },
  forest: {
    color: tokens.colorPaletteForestForeground2,
    backgroundColor: tokens.colorPaletteForestBackground2,
  },
  seafoam: {
    color: tokens.colorPaletteSeafoamForeground2,
    backgroundColor: tokens.colorPaletteSeafoamBackground2,
  },
  "dark-green": {
    color: tokens.colorPaletteDarkGreenForeground2,
    backgroundColor: tokens.colorPaletteDarkGreenBackground2,
  },
  "light-teal": {
    color: tokens.colorPaletteLightTealForeground2,
    backgroundColor: tokens.colorPaletteLightTealBackground2,
  },
  teal: {
    color: tokens.colorPaletteTealForeground2,
    backgroundColor: tokens.colorPaletteTealBackground2,
  },
  steel: {
    color: tokens.colorPaletteSteelForeground2,
    backgroundColor: tokens.colorPaletteSteelBackground2,
  },
  blue: {
    color: tokens.colorPaletteBlueForeground2,
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  "royal-blue": {
    color: tokens.colorPaletteRoyalBlueForeground2,
    backgroundColor: tokens.colorPaletteRoyalBlueBackground2,
  },
  cornflower: {
    color: tokens.colorPaletteCornflowerForeground2,
    backgroundColor: tokens.colorPaletteCornflowerBackground2,
  },
  navy: {
    color: tokens.colorPaletteNavyForeground2,
    backgroundColor: tokens.colorPaletteNavyBackground2,
  },
  lavender: {
    color: tokens.colorPaletteLavenderForeground2,
    backgroundColor: tokens.colorPaletteLavenderBackground2,
  },
  purple: {
    color: tokens.colorPalettePurpleForeground2,
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  grape: {
    color: tokens.colorPaletteGrapeForeground2,
    backgroundColor: tokens.colorPaletteGrapeBackground2,
  },
  lilac: {
    color: tokens.colorPaletteLilacForeground2,
    backgroundColor: tokens.colorPaletteLilacBackground2,
  },
  pink: {
    color: tokens.colorPalettePinkForeground2,
    backgroundColor: tokens.colorPalettePinkBackground2,
  },
  magenta: {
    color: tokens.colorPaletteMagentaForeground2,
    backgroundColor: tokens.colorPaletteMagentaBackground2,
  },
  plum: {
    color: tokens.colorPalettePlumForeground2,
    backgroundColor: tokens.colorPalettePlumBackground2,
  },
  beige: {
    color: tokens.colorPaletteBeigeForeground2,
    backgroundColor: tokens.colorPaletteBeigeBackground2,
  },
  mink: {
    color: tokens.colorPaletteMinkForeground2,
    backgroundColor: tokens.colorPaletteMinkBackground2,
  },
  platinum: {
    color: tokens.colorPalettePlatinumForeground2,
    backgroundColor: tokens.colorPalettePlatinumBackground2,
  },
  anchor: {
    color: tokens.colorPaletteAnchorForeground2,
    backgroundColor: tokens.colorPaletteAnchorBackground2,
  },
});

const ringColorStyles = makeStyles({
  neutral: {
    "::before": { color: tokens.colorBrandStroke1 },
  },
  brand: {
    "::before": { color: tokens.colorBrandStroke1 },
  },
  "dark-red": {
    "::before": { color: tokens.colorPaletteDarkRedBorderActive },
  },
  cranberry: {
    "::before": { color: tokens.colorPaletteCranberryBorderActive },
  },
  red: {
    "::before": { color: tokens.colorPaletteRedBorderActive },
  },
  pumpkin: {
    "::before": { color: tokens.colorPalettePumpkinBorderActive },
  },
  peach: {
    "::before": { color: tokens.colorPalettePeachBorderActive },
  },
  marigold: {
    "::before": { color: tokens.colorPaletteMarigoldBorderActive },
  },
  gold: {
    "::before": { color: tokens.colorPaletteGoldBorderActive },
  },
  brass: {
    "::before": { color: tokens.colorPaletteBrassBorderActive },
  },
  brown: {
    "::before": { color: tokens.colorPaletteBrownBorderActive },
  },
  forest: {
    "::before": { color: tokens.colorPaletteForestBorderActive },
  },
  seafoam: {
    "::before": { color: tokens.colorPaletteSeafoamBorderActive },
  },
  "dark-green": {
    "::before": { color: tokens.colorPaletteDarkGreenBorderActive },
  },
  "light-teal": {
    "::before": { color: tokens.colorPaletteLightTealBorderActive },
  },
  teal: {
    "::before": { color: tokens.colorPaletteTealBorderActive },
  },
  steel: {
    "::before": { color: tokens.colorPaletteSteelBorderActive },
  },
  blue: {
    "::before": { color: tokens.colorPaletteBlueBorderActive },
  },
  "royal-blue": {
    "::before": { color: tokens.colorPaletteRoyalBlueBorderActive },
  },
  cornflower: {
    "::before": { color: tokens.colorPaletteCornflowerBorderActive },
  },
  navy: {
    "::before": { color: tokens.colorPaletteNavyBorderActive },
  },
  lavender: {
    "::before": { color: tokens.colorPaletteLavenderBorderActive },
  },
  purple: {
    "::before": { color: tokens.colorPalettePurpleBorderActive },
  },
  grape: {
    "::before": { color: tokens.colorPaletteGrapeBorderActive },
  },
  lilac: {
    "::before": { color: tokens.colorPaletteLilacBorderActive },
  },
  pink: {
    "::before": { color: tokens.colorPalettePinkBorderActive },
  },
  magenta: {
    "::before": { color: tokens.colorPaletteMagentaBorderActive },
  },
  plum: {
    "::before": { color: tokens.colorPalettePlumBorderActive },
  },
  beige: {
    "::before": { color: tokens.colorPaletteBeigeBorderActive },
  },
  mink: {
    "::before": { color: tokens.colorPaletteMinkBorderActive },
  },
  platinum: {
    "::before": { color: tokens.colorPalettePlatinumBorderActive },
  },
  anchor: {
    "::before": { color: tokens.colorPaletteAnchorBorderActive },
  },
});

export default (
  shape: FAvatarShape,
  active: FAvatarActive,
  badge: boolean,
  color: "neutral" | "brand" | FAvatarNamedColor,
) => {
  const rootClasses = [rootClassName];
  if (badge) {
    rootClasses.push(styles.badgeAlign, styles.medium);
  }
  if (shape === "square") {
    rootClasses.push(styles.squareMedium);
  }
  if (active === "active" || active === "inactive") {
    rootClasses.push(styles.activeOrInactive);
    rootClasses.push(styles.ring, ringColorStyles[color]);
    if (badge) {
      rootClasses.push(styles.ringBadgeCutout);
    }
    rootClasses.push(styles.ringThick);
    if (active === "inactive") {
      rootClasses.push(styles.inactive);
    }
  }
  return defineStyles({
    root: [avatarClassNames.root, ...rootClasses],
    badge: [avatarClassNames.badge, styles.badge],
    image: [
      avatarClassNames.image,
      imageClassName,
      colorStyles[color],
      badge && styles.badgeCutout,
    ],
    initials: [
      avatarClassNames.initials,
      iconInitialsClassName,
      colorStyles[color],
      badge && styles.badgeCutout,
    ],
    icon: [
      avatarClassNames.icon,
      iconInitialsClassName,
      styles.icon20,
      colorStyles[color],
      badge && styles.badgeCutout,
    ],
  });
};
