import { View, ViewRender, ViewState } from "./view";
import { Ref, getD } from "./data";
import {
  Component,
  ComponentConstructor,
  ComponentFuncs,
} from "./component/index";
import {
  DOMFuncs,
  DOMNodeComponent,
  HTMLElementComponent,
  createCbHTMLElementComponentFunction,
} from "./dom";

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

  $preventDefault() {
    const ev = this.$view.eventData;
    if (typeof ev?.preventDefault !== "function") {
      throw new Error(`Cannot prevent default on ${ev}.`);
    }
    ev.preventDefault();
  }

  $ref<C2>(ref: Ref<C2>): this is Context<C2> {
    this.$pendingRef = ref;
    return true;
  }
  $pendingRef: Ref<any> | null = null;

  $clear(ref: Ref<{ readonly ikey: string }>) {
    if (ref.current) {
      this.$view.map.delete(ref.current.ikey);
    }
    ref.current = null;
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

  $$(funcName: string, ...argsWithCKey: [ckey: string, ...args: any[]]): any {
    if (funcName === "_t") {
      // Now this is a text node
      const [ckey, text] = argsWithCKey;
      if (this.$classes.length > 0) {
        throw new Error(`Text node cannot have classes`);
      }
      const setFirstDOMNode = this.$firstDOMNode === null;
      const t = this.renderText(ckey, getD(text));
      if (setFirstDOMNode) this.$firstDOMNode ??= t;
      return t;
    }
    if (
      funcName.startsWith("_cb") &&
      funcName[3].toUpperCase() === funcName[3]
    ) {
      // Now this is a cb-style HTML element
      const tagName = (funcName[3].toLowerCase() +
        funcName.slice(4)) as keyof HTMLElementTagNameMap;
      const func = createCbHTMLElementComponentFunction(tagName);
      return func.call(this as unknown as Context, ...argsWithCKey);
    }
    if (funcName[0] === "_") {
      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      let [ckey, data, inner] = argsWithCKey;
      inner = getD(inner);
      if (typeof inner === "string" || typeof inner === "number") {
        const text = inner;
        inner = () => {
          if (this.$classes.length > 0) {
            throw new Error(`Text node cannot have classes`);
          }
          const setFirstDOMNode = this.$firstDOMNode === null;
          const t = this.renderText("_t", String(text));
          if (setFirstDOMNode) this.$firstDOMNode ??= t;
        };
      }
      data ??= {};
      inner ??= () => {};
      const setFirstDOMNode = this.$firstDOMNode === null;
      const setFirstHTMLELement = this.$firstHTMLELement === null;
      const pendingRef = this.$pendingRef;
      this.$pendingRef = null;
      const ec = this.renderHTMLElement(
        ckey,
        tagName,
        data,
        inner,
        this.$classes,
      );
      if (setFirstDOMNode) this.$firstDOMNode = ec;
      if (setFirstHTMLELement) this.$firstHTMLELement = ec;
      if (pendingRef) pendingRef.current = ec;
      return ec;
    }
    // Now this is a user-defined component
    const func = contextFuncs[funcName];
    if (!func) {
      throw new Error(`Unknown element ${funcName}`);
    }
    return func.call(this, ...argsWithCKey);
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
    let component = this.$view.map.get(ikey) as T;
    if (!component) {
      component = new ctor(ikey);
      this.$view.map.set(ikey, component);
    }
    if (this.$pendingRef) {
      this.$pendingRef.current = component;
      this.$pendingRef = null;
    }
    return component;
  }
  endComponent(ckey: string) {
    this.$view.popKey(ckey);
  }

  protected renderHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    data: Partial<HTMLElementTagNameMap[E]>,
    inner: ViewRender,
    classes: string[],
  ) {
    this.$view.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    let ec = this.$view.map.get(ikey) as HTMLElementComponent | undefined;
    const oldParent = this.$view.currrentHTMLParent;
    switch (this.$state) {
      case ViewState.update:
        if (!ec) {
          ec = new HTMLElementComponent(ikey, document.createElement(tagName));
          this.$view.map.set(ikey, ec);
        }
        for (const key in data) {
          //@ts-ignore
          ec.node[key] = data[key]!;
        }
        ec.setClasses(classes);
        oldParent.children.push(ec);
        ec.children = [];
        this.$view.currrentHTMLParent = ec;
        inner(this as unknown as Context);
        this.$view.callHookAfterThisComponent();
        break;
      case ViewState.recv:
        this.$view.currrentHTMLParent = ec!;
        inner(this as unknown as Context);
        this.$view.callHookAfterThisComponent();
        break;
    }
    this.$view.currrentHTMLParent = oldParent;
    this.$view.popKey(ckey);
    return ec!;
  }
  protected renderText(ckey: string, text: string) {
    this.$view.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    let t = this.$view.map.get(ikey) as DOMNodeComponent | undefined;
    if (this.$state === ViewState.update) {
      if (!t) {
        t = new DOMNodeComponent(ikey, document.createTextNode(text));
        this.$view.map.set(ikey, t);
      } else {
        if (t.node.textContent !== text) t.node.textContent = text;
      }
      this.$view.currrentHTMLParent.children.push(t);
    }
    this.$view.popKey(ckey);
    return t!;
  }
}

export type Context<C = any> = ToFullContext<C, IntrinsicContext<C>>;
