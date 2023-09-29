import { D } from "../data";
import { DOMNodeComponent } from "./base";

export class TextNodeComponent extends DOMNodeComponent {
  createDOM() {}
  updateDOM() {}
}

export type TextNodeFunc = {
  t(template: TemplateStringsArray, ...args: any[]): void;
  t(text: D<string>): void;
};
