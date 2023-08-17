import { ViewRender, ViewState } from "./view";
import { D, ref } from "./data";
import {
  CallbackComponent,
  CallbackComponentContext,
  ToCallbackComponentFuncs,
  createCallbackComponentFunc,
} from "./component/index";
import { Context } from "./context";

export class DOMNodeComponent<N extends Node = Node> {
  constructor(
    public ikey: string,
    public node: N
  ) {}

  createDOM() {}
  updateDOM() {}
}

export class HTMLElementComponent<
  E extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> extends DOMNodeComponent<HTMLElementTagNameMap[E]> {
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
    }
    this.createdChildren = new Set(this.children);
  }

  setClasses(classes: string[]) {
    // Is this the best way to do this?
    if (this.node.classList.length > 0) this.node.className = "";
    if (classes.length > 0) this.node.classList.add(...classes);
  }
  addClasses(classes: string[]) {
    if (classes.length > 0) this.node.classList.add(...classes);
  }
}

export function createCbHTMLElementComponentFunction<
  E extends keyof HTMLElementTagNameMap,
>(tagName: E) {
  const ctor = class
    extends CallbackComponent<HTMLElementEventMap>
    implements CbHTMLElementComponent<E>
  {
    main(
      _: CallbackComponentContext<HTMLElementEventMap, this>,
      data: Partial<HTMLElementTagNameMap[E]> = {},
      inner: D<ViewRender | string | number> = () => {}
    ) {
      const elementData: any = { ...data };
      for (const ev of this.$listendEvs) {
        elementData[`on${ev}`] = _.$firer(ev);
      }
      (
        _.$$ as (
          funcName: string,
          ckey: string,
          data?: Partial<HTMLElementTagNameMap[E]>,
          inner?: D<ViewRender | string | number>
          // @ts-ignore
        ) => this is Context<HTMLElementComponent<E>>
      )(`_${tagName}`, "_", elementData, inner);
    }
  };
  return createCallbackComponentFunc(ctor);
}

const cbHTMLElementComponentFunctionCache = new Map<
  keyof HTMLElementTagNameMap,
  (this: Context, ckey: string, ...args: any[]) => boolean
>();

export function getCbHTMLElementComponentFunction<
  E extends keyof HTMLElementTagNameMap,
>(tagName: E) {
  if (!cbHTMLElementComponentFunctionCache.has(tagName)) {
    cbHTMLElementComponentFunctionCache.set(
      tagName,
      createCbHTMLElementComponentFunction(tagName)
    );
  }
  return cbHTMLElementComponentFunctionCache.get(tagName)!;
}

export interface CbHTMLElementComponent<E extends keyof HTMLElementTagNameMap>
  extends CallbackComponent<HTMLElementEventMap> {
  main(
    _: CallbackComponentContext<HTMLElementEventMap, this>,
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: D<ViewRender | string | number>
  ): void;
}
export type DOMFuncs<C> = {
  [E in keyof HTMLElementTagNameMap as `_${E}`]: HTMLElementComponent<E> extends C
    ? (
        data?: Partial<HTMLElementTagNameMap[E]>,
        inner?: D<ViewRender | string | number>
        // @ts-ignore
      ) => this is Context<HTMLElementComponent<E>>
    : never;
} & ToCallbackComponentFuncs<
  {
    [E in keyof HTMLElementTagNameMap as `_cb${Capitalize<E>}`]: CbHTMLElementComponent<E>;
  },
  C
> & {
    _t: (text: D<string | number>) => void;
  };
