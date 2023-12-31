/**
 * The height of the tooltip's arrow in pixels.
 */
export const arrowHeight = 6;

/**
 * The default value of the tooltip's border radius (borderRadiusMedium).
 *
 * Unfortunately, Popper requires it to be specified as a variable instead of using CSS.
 * While we could use getComputedStyle, that adds a performance penalty for something that
 * will likely never change.
 */
export const tooltipBorderRadius = 4;

export const visibleTooltipSymbol = Symbol("visibleTooltip");
