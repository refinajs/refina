import { D } from "../data";
import { DOMElementTagNameMap, DOMNodeComponent, Content } from "./base";

type DOMElementType<E extends keyof DOMElementTagNameMap> =
  E extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[E]
    : E extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[E]
    : never;

export class DOMElementComponent<
  E extends keyof DOMElementTagNameMap = keyof DOMElementTagNameMap,
> extends DOMNodeComponent<DOMElementType<E>> {
  children: DOMNodeComponent[] = [];
  protected createdChildren = new Set<DOMNodeComponent>();

  createDOM() {
    for (const child of this.children) {
      child.createDOM();
      this.node.appendChild(child.node);
      this.createdChildren.add(child);
    }
  }

  updateDOM() {
    let createdUnused = new Set<DOMNodeComponent>(this.createdChildren);
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
          if (this.node.firstChild) {
            this.node.firstChild.before(child.node);
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
    }
    this.createdChildren = new Set(this.children);
  }

  currentClasses = new Set<string>();
  setClasses(classes: string[]) {
    for (const cls of classes) {
      if (!this.currentClasses.has(cls)) {
        this.node.classList.add(cls);
      } else {
        this.currentClasses.delete(cls);
      }
    }
    for (const cls of this.currentClasses) {
      this.node.classList.remove(cls);
    }
    this.currentClasses = new Set(classes);
  }
  addClasses(classes: string[]) {
    if (classes.length > 0) {
      this.node.classList.add(...classes);
      for (const cls of classes) {
        this.currentClasses.add(cls);
      }
    }
  }

  currentStyle: string = "";
  setStyle(style: string) {
    if (style !== this.currentStyle) {
      this.node.style.cssText = style;
      this.currentStyle = style;
    }
  }
  addStyle(style: string) {
    if (style.length > 0) {
      this.node.style.cssText += style;
      this.currentStyle += style;
    }
  }
}

export type HTMLElementComponent<
  E extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> = DOMElementComponent<E>;

export type SVGElementComponent<
  E extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap,
> = DOMElementComponent<E>;

export type HTMLElementFuncs<C> = {
  [E in keyof HTMLElementTagNameMap as `_${E}`]: DOMElementComponent<E> extends C
    ? (
        data?: Partial<HTMLElementTagNameMap[E]>,
        inner?: D<Content>,
        //@ts-ignore
      ) => this is Context<DOMElementComponent<E>>
    : never;
};

export type SVGElementFuncs<C> = {
  [E in keyof SVGElementTagNameMap as `_svg${Capitalize<E>}`]: DOMElementComponent<E> extends C
    ? (
        data?: Record<string, D<string | number>>,
        inner?: D<Content>,
        //@ts-ignore
      ) => this is Context<DOMElementComponent<E>>
    : never;
};
