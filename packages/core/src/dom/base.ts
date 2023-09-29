import { View } from "../context";

export abstract class DOMNodeComponent<N extends Node = Node> {
  constructor(
    public ikey: string,
    public node: N,
  ) {}

  abstract createDOM(): void;
  abstract updateDOM(): void;

  appendTo(parent: Element) {
    parent.appendChild(this.node);
  }
  removeFrom(parent: Element) {
    parent.removeChild(this.node);
  }
  insertBefore(element: ChildNode) {
    element.before(this.node);
  }
  insertAfter(element: ChildNode) {
    element.after(this.node);
  }
}

export type DOMElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

export type Content<Args extends any[] = []> = string | number | View<Args>;
