import {
  GriffelStyle,
  createDOMRenderer,
  makeResetStyles as vanillaMakeResetStyles,
  makeStaticStyles as vanillaMakeStaticStyles,
  makeStyles as vanillaMakeStyles,
  mergeClasses as vanillaMergeClasses,
  type GriffelResetStyle,
  type GriffelStaticStyles,
} from "@griffel/core";
import { $clsFunc, Context } from "refina";

let dir: "ltr" | "rtl" = "ltr";
export function setDir(newDir: "ltr" | "rtl") {
  dir = newDir;
}
const renderer = createDOMRenderer();

export function makeStyles<
  Styles extends { [P in string | number]: GriffelStyle },
>(stylesBySlots: Styles): { [K in keyof Styles]: string } {
  return vanillaMakeStyles(stylesBySlots)({ dir, renderer }) as any;
}

export function makeResetStyles(styles: GriffelResetStyle) {
  return vanillaMakeResetStyles(styles)({ dir, renderer });
}

export function makeStaticStyles(
  styles: GriffelStaticStyles | GriffelStaticStyles[],
) {
  return vanillaMakeStaticStyles(styles)({ renderer });
}

export function mergeClasses(
  ...classNames: (string | false | undefined)[]
): (_: Context) => true {
  return $clsFunc(vanillaMergeClasses(...classNames));
}

export {
  shorthands,
  type GriffelResetStyle,
  type GriffelStyle,
} from "@griffel/core";
