import {
  GriffelStyle,
  createDOMRenderer,
  mergeClasses,
  makeResetStyles as vanillaMakeResetStyles,
  makeStaticStyles as vanillaMakeStaticStyles,
  makeStyles as vanillaMakeStyles,
  type GriffelResetStyle,
  type GriffelStaticStyles,
} from "@griffel/core";
import { _ } from "refina";

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

export function defineStyles<
  T extends Record<string, (string | false | undefined)[]>,
>(
  styles: T,
): {
  [K in Extract<keyof T, string>]: () => true;
} {
  const result = {} as any;
  if (_.$recvContext) {
    for (const key in styles) {
      result[key] = () => true;
    }
  } else {
    for (const key in styles) {
      result[key] = () => {
        const cls = mergeClasses(...styles[key]);
        _.$cls(cls);
        return true;
      };
    }
  }
  return result;
}

export {
  mergeClasses,
  shorthands,
  type GriffelResetStyle,
  type GriffelStyle,
} from "@griffel/core";
