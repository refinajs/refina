import { View } from "../context";

export abstract class DOMNodeComponent<N extends Node = Node> {
  constructor(
    public ikey: string,
    public node: N,
  ) {}

  abstract createDOM(): void;
  abstract updateDOM(): void;
}

export type DOMElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

export type Content<Args extends any[] = []> = string | number | View<Args>;
