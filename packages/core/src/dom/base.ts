import type { Context } from "../context";
import { getD, type D } from "../data";
import type { View } from "../view";

export type MaybeChildNode = ChildNode | null;

export interface DOMNodeComponentActionResult {
  lastEl: MaybeChildNode;
  thisEl: MaybeChildNode;
}

export abstract class DOMNodeComponent<N extends Node = Node> {
  constructor(
    public ikey: string,
    public node: N,
  ) {}

  abstract updateDOMTree(): DOMNodeComponentActionResult;

  appendTo(parent: Element) {
    parent.appendChild(this.node);
    return this.node as unknown as MaybeChildNode;
  }
  prependTo(parent: Element) {
    parent.firstChild!.before(this.node);
    return this.node as unknown as MaybeChildNode;
  }
  insertAfter(element: ChildNode) {
    element.after(this.node);
    return this.node as unknown as MaybeChildNode;
  }
  removeFrom(parent: Element): void {
    parent.removeChild(this.node);
  }
}

export type DOMElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

export type Content<Args extends any[] = []> = string | number | View<Args>;

export function bindArgsToContent<Args extends any[]>(
  content: D<Content<Args>>,
  ...args: Args
) {
  const contentValue = getD(content);
  if (typeof contentValue === "function") {
    return (ctx: Context) => contentValue(ctx, ...args);
  }
  return contentValue;
}
