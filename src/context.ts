import {
  Component,
  ComponentConstructor,
  ComponentFuncs,
} from "./component/index";
import { D, Ref, getD } from "./data";
import {
  DOMFuncs,
  DOMNodeComponent,
  HTMLElementComponent,
  createCbHTMLElementComponentFunction,
} from "./dom";
import { View, ViewRender, ViewState } from "./view";

export const contextFuncs = {} as {
  [K in keyof CustomContext<any>]: K extends `$${string}`
    ? CustomContext<any>[K]
    : (
        id: string,
        ...args: Parameters<CustomContext<any>[K]>
      ) => ReturnType<CustomContext<any>[K]>;
};

type CustomContextFuncsBase = {
  [K in string]: K extends `$${string}` ? any : (...args: any[]) => any;
};

export interface CustomContext<C> extends CustomContextFuncsBase {}

export type ToFullContext<C, I> = ComponentFuncs<C> &
  CustomContext<C> &
  DOMFuncs<C> &
  I;

export class IntrinsicContext<C = any> {
  constructor(public readonly $view: View) {
    Object.defineProperty(this, "$ev", {
      get() {
        return $view.eventData;
      },
    });
    Object.defineProperty(this, "$", {
      get() {
        return this.$view.eventRecevier ?? this.$cbComponent;
      },
    });
  }

  get $state() {
    return this.$view.state;
  }
  $cbComponent: C = null as any;

  $preventDefault(): true {
    const ev = this.$view.eventData;
    if (typeof ev?.preventDefault !== "function") {
      throw new Error(`Cannot prevent default on ${ev}.`);
    }
    ev.preventDefault();
    return true;
  }

  $ref<C2>(ref: Ref<C2>): this is Context<C2> {
    this.$pendingRef = ref;
    return true;
  }
  $pendingRef: Ref<any> | null = null;

  $noPreserve(deep: boolean = true): true {
    this.$pendingNoPreserve = deep ? "deep" : true;
    return true;
  }
  protected $pendingNoPreserve: boolean | "deep" = false;
  protected $allNoPreserve = false;
  protected get $isNoPreserve() {
    return Boolean(this.$allNoPreserve || this.$pendingNoPreserve);
  }

  $cls(...args: any[]): void {
    if (Array.isArray(args[0])) {
      this.$pendingClasses = String.raw({ raw: args[0] }, ...args.slice(1))
        .split(" ")
        .filter(Boolean);
    } else {
      this.$pendingClasses = args;
    }
  }
  protected $pendingClasses: string[] = [];
  get $classes() {
    const classes = this.$pendingClasses;
    this.$pendingClasses = [];
    return classes;
  }

  $$(funcName: string, ckey: string, ...args: any[]): any {
    if (funcName === "_t") {
      // Now this is a text node
      const [text] = args;
      if (this.$classes.length > 0) {
        throw new Error(`Text node cannot have classes`);
      }
      return this.processTextNode(ckey, getD(text));
    }
    if (
      funcName.startsWith("_cb") &&
      funcName[3].toUpperCase() === funcName[3]
    ) {
      // Now this is a cb-style HTML element
      const tagName = (funcName[3].toLowerCase() +
        funcName.slice(4)) as keyof HTMLElementTagNameMap;
      const func = createCbHTMLElementComponentFunction(tagName);
      return func.call(this as unknown as Context, ckey, ...args);
    }
    if (funcName[0] === "_") {
      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      let [data, inner] = args;
      return this.processHTMLElement(ckey, tagName, this.$classes, data, inner);
    }
    // Now this is a user-defined component
    const func = contextFuncs[funcName];
    if (!func) {
      throw new Error(`Unknown element ${funcName}`);
    }
    return func.call(this, ckey, ...args);
  }

  $firstDOMNode: DOMNodeComponent | null = null;
  $firstHTMLELement: HTMLElementComponent | null = null;

  beginComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
  ) {
    this.$view.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    this.$view.markComponentProcessed(ikey);
    let component = this.$view.refMap.get(ikey) as T;
    if (!component) {
      component = new ctor(ikey);
      this.$view.refMap.set(ikey, component);
    }
    if (this.$pendingRef) {
      this.$pendingRef.current = component;
      this.$pendingRef = null;
    }
    if (this.$isNoPreserve) {
      this.$view.noPreserveComponents.add(ikey);
      // later set by IntrinsicComponentContext: this.$pendingNoPreserve = false;
    }
    return component;
  }
  endComponent(ckey: string) {
    this.$view.popKey(ckey);
  }

  protected processHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    classes: string[],
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: D<ViewRender | string | number>,
  ) {
    inner = getD(inner);
    if (typeof inner === "string" || typeof inner === "number") {
      const text = inner;
      inner = () => {
        if (this.$classes.length > 0) {
          throw new Error(`Text node cannot have classes`);
        }
        const setFirstDOMNode = this.$firstDOMNode === null;
        const t = this.processTextNode("_t", String(text));
        if (setFirstDOMNode) this.$firstDOMNode ??= t;
      };
    }
    data ??= {};
    inner ??= () => {};

    this.$view.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    this.$view.markComponentProcessed(ikey);
    let ec = this.$view.refMap.get(ikey) as HTMLElementComponent | undefined;
    const oldParent = this.$view.currrentHTMLParent;
    if (this.$state === ViewState.update) {
      if (!ec) {
        console.warn("create new el", tagName, "for", ikey);
        ec = new HTMLElementComponent(ikey, document.createElement(tagName));
        this.$view.refMap.set(ikey, ec);
      }
      for (const key in data) {
        //@ts-ignore
        ec.node[key] = data[key]!;
      }
      ec.setClasses(classes);
      oldParent.children.push(ec);
      ec.children = [];
    }

    const context = new IntrinsicContext(this.$view);

    this.$firstDOMNode ??= ec!;
    this.$firstHTMLELement ??= ec!;

    if (this.$pendingRef) {
      this.$pendingRef.current = ec;
      this.$pendingRef = null;
    }
    if (this.$isNoPreserve) {
      this.$view.noPreserveComponents.add(ikey);
      if (this.$pendingNoPreserve === "deep") context.$allNoPreserve = true;
      this.$pendingNoPreserve = false;
    }

    this.$view.currrentHTMLParent = ec!;

    inner(context as unknown as Context);

    this.$view.callHookAfterThisComponent();

    this.$view.currrentHTMLParent = oldParent;

    this.$view.popKey(ckey);

    return ec!;
  }
  protected processTextNode(ckey: string, text: string) {
    this.$view.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    this.$view.markComponentProcessed(ikey);
    let t = this.$view.refMap.get(ikey) as DOMNodeComponent | undefined;
    if (this.$state === ViewState.update) {
      if (!t) {
        t = new DOMNodeComponent(ikey, document.createTextNode(text));
        this.$view.refMap.set(ikey, t);
      } else {
        if (t.node.textContent !== text) t.node.textContent = text;
      }
      this.$view.currrentHTMLParent.children.push(t);
    }
    this.$view.popKey(ckey);

    this.$firstDOMNode ??= t!;

    if (this.$allNoPreserve || this.$pendingNoPreserve) {
      this.$view.noPreserveComponents.add(ikey);
      this.$pendingNoPreserve = false;
    }

    return t!;
  }
}

export type Context<C = any> = ToFullContext<C, IntrinsicContext<C>>;
