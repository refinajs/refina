import { D } from "../data";
import { DOMNodeComponent, DOMNodeComponentActionResult } from "./base";

export class TextNodeComponent extends DOMNodeComponent {
  createDOM(): DOMNodeComponentActionResult {
    return { lastEl: null, thisEl: null };
  }
  updateDOM(): DOMNodeComponentActionResult {
    return { lastEl: null, thisEl: null };
  }
}

export type TextNodeFunc = {
  t(template: TemplateStringsArray, ...args: any[]): void;
  t(text: D<string>): void;
};
