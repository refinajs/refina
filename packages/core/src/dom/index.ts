import { CbHTMLElementFuncs } from "./cbElement";
import { HTMLElementFuncs, SVGElementFuncs } from "./domElement";
import { TextNodeFunc } from "./textNode";

export type DOMFuncs<C> = CbHTMLElementFuncs<C> &
  HTMLElementFuncs<C> &
  SVGElementFuncs<C> &
  TextNodeFunc;

export * from "./base";
export * from "./cbElement";
export * from "./domElement";
export * from "./portal";
export * from "./root";
export * from "./textNode";
