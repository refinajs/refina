import { ViewRender } from "./view";
import { D } from "./data";

export class DOMComponent {
  constructor(
    public ikey: string,
    public node: Node
  ) {}

  createDOM() {}
  updateDOM() {}
}
export class HTMLElementComponent extends DOMComponent {
  children: DOMComponent[] = [];
  protected createdChildren = new Set<DOMComponent>();

  createDOM() {
    for (const child of this.children) {
      child.createDOM();
      this.node.appendChild(child.node);
      this.createdChildren.add(child);
    }
  }

  updateDOM() {
    let createdUnused = new Set<DOMComponent>(this.createdChildren);
    let lastChildEl: null | ChildNode = null;
    for (const child of this.children) {
      if (this.createdChildren.has(child)) {
        child.updateDOM();
        createdUnused.delete(child);
      } else {
        child.createDOM();
        if (lastChildEl) {
          lastChildEl.after(child.node);
        } else {
          if (this.node.lastChild) {
            this.node.lastChild.before(child.node);
          } else {
            this.node.appendChild(child.node);
          }
        }
        child.updateDOM();
      }
      lastChildEl = child.node as ChildNode;
    }
    for (const unusedChild of createdUnused) {
      this.node.removeChild(unusedChild.node);
      this.createdChildren.delete(unusedChild);
    }
  }
}

export type DOMFuncs<C> = {
  [E in keyof HTMLElementTagNameMap as `_${E}`]: HTMLElementTagNameMap[E] extends C
    ? (
        data: Partial<HTMLElementTagNameMap[E]>,
        inner?: ViewRender | string
        // @ts-ignore
      ) => this is Context<HTMLElementTagNameMap[E]>
    : never;
} & {
  _t: (text: D<string>) => void;
};
