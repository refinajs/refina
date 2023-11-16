import { ContextState } from "../context";
import { HTMLElementFuncs, SVGElementFuncs } from "./domElement";
import { TextNodeFuncs } from "./textNode";

export * from "./base";
export * from "./domElement";
export * from "./portal";
export * from "./root";
export * from "./textNode";

export type DOMFuncs<C extends ContextState> = HTMLElementFuncs<C> &
  SVGElementFuncs<C> &
  TextNodeFuncs<C>;

declare module "../context" {
  interface ContextFuncs<C> extends DOMFuncs<C> {}
}
