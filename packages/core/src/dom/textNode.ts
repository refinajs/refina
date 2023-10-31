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

export type TextNodeFunc = {
  t(template: TemplateStringsArray, ...args: any[]): void;
  t(text: D<string>): void;
};
