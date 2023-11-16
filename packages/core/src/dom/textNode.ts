import { ContextState } from "../context";
import { D } from "../data";
import { DOMNodeComponent, DOMNodeComponentActionResult } from "./base";

export class TextNodeComponent extends DOMNodeComponent {
  createDOM(): DOMNodeComponentActionResult {
    return { lastEl: null, thisEl: this.node as ChildNode };
  }
  updateDOM(): DOMNodeComponentActionResult {
    return { lastEl: null, thisEl: this.node as ChildNode };
  }
}

export type TextNodeFuncs<C extends ContextState> = {
  t: TextNodeComponent extends C["enabled"]
    ? ((template: TemplateStringsArray, ...args: any[]) => void) &
        ((text: D<string>) => void)
    : never;
};
