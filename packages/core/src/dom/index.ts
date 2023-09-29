import { CbHTMLElementFuncs } from "./cbElement";
import { HTMLElementFuncs, SVGElementFuncs } from "./domElement";
import { PortalFunc } from "./portal";

export type DOMFuncs<C> = HTMLElementFuncs<C> &
  SVGElementFuncs<C> &
  CbHTMLElementFuncs<C> &
  PortalFunc<C>;

export * from "./base";
export * from "./cbElement";
export * from "./domElement";
export * from "./portal";
export * from "./textNode";
