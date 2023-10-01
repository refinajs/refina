import {
  defaultOptions,
  FOCUS_VISIBLE_ATTR,
  FOCUS_WITHIN_ATTR,
} from "./constants";
import { makeResetStyles, type GriffelStyle } from "@refina/griffel";

// TODO: Use the type directly from @griffel/react
// https://github.com/microsoft/griffel/pull/278
type GriffelResetStyle = Parameters<typeof makeResetStyles>[0];

export interface CreateCustomFocusIndicatorStyleOptions {
  /**
   * Control if the indicator appears when the corresponding element is focused,
   * or any child is focused within the corresponding element.
   * @default 'focus'
   * @alias selectorType
   */
  selector?: "focus" | "focus-within";
  /**
   * Customizes the selector provided based on the selector type.
   */
  customizeSelector?: (selector: string) => string;
  /**
   * Enables the browser default outline style
   * @deprecated The custom focus indicator no longer affects outline styles. Outline is overridden
   * in the default focus indicator function, `createFocusOutlineStyle`.
   */
  enableOutline?: boolean;
}

/**
 * Creates a style for @see makeStyles that includes the necessary selectors for focus.
 * Should be used only when @see createFocusOutlineStyle does not fit requirements
 *
 * @param style - styling applied on focus, defaults to @see getDefaultFocusOutlineStyles
 * @param options - Configure the style of the focus outline
 */
export function createCustomFocusIndicatorStyle<
  TStyle extends GriffelStyle | GriffelResetStyle,
>(
  style: TStyle,
  {
    selector: selectorType = defaultOptions.selector,
    customizeSelector = defaultOptions.customizeSelector,
  }: CreateCustomFocusIndicatorStyleOptions = defaultOptions,
): TStyle extends GriffelStyle ? GriffelStyle : GriffelResetStyle {
  return { [customizeSelector(createBaseSelector(selectorType))]: style };
}

function createBaseSelector(selectorType: "focus" | "focus-within"): string {
  switch (selectorType) {
    case "focus":
      return `&[${FOCUS_VISIBLE_ATTR}]`;
    case "focus-within":
      return `&[${FOCUS_WITHIN_ATTR}]:focus-within`;
  }
}
