import { CbHTMLElementFuncs } from "./cbElement";
import { HTMLElementFuncs, SVGElementFuncs } from "./domElement";

export type DOMFuncs<C> = HTMLElementFuncs<C> &
  SVGElementFuncs<C> &
  CbHTMLElementFuncs<C>;

export * from "./base";
export * from "./cbElement";
export * from "./domElement";
export * from "./textNode";
