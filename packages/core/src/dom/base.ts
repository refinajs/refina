import { View } from "../context";

export class DOMNodeComponent<N extends Node = Node> {
  constructor(
    public ikey: string,
    public node: N,
  ) {}

  createDOM() {}
  updateDOM() {}
}

export type DOMElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

export type Content = string | number | View;
