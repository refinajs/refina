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
  [K in keyof CustomContext<any, unknown>]: K extends `$${string}`
    ? CustomContext<any, unknown>[K]
    : (
        id: string,
        ...args: Parameters<CustomContext<any, unknown>[K]>
      ) => ReturnType<CustomContext<any, unknown>[K]>;
};

type CustomContextFuncsBase = {
  [K in string]: K extends `$${string}` ? any : (...args: any[]) => any;
};
/**
 * @typeParam C - The type of `context.$`
 * @typeParam Ev - The type of `context.$ev`
 */
export interface CustomContext<C, Ev> extends CustomContextFuncsBase {}

export interface IntrinsicContext<C = any, Ev = unknown> {
  readonly $: C;
  readonly $ev: Ev;
  readonly $view: View;
  readonly $state: ViewState;
  $cbComponent: C;

  /**
   * Called before next component and after all components using this context is rendered.
   */
  $hookAfterThisComponent: null | (() => void);

  // @ts-ignore
  $ref<C>(ref: Ref<C>): this is Context<C>;
  $pendingRef: Ref<any> | null;

  $cls(classes: string[]): void;
  $cls(strings: TemplateStringsArray, ...exps: any[]): void;
  readonly $classes: string[];

  $$<N extends keyof Context>(
    funcName: N,
    ckey: string,
    ...args: Parameters<Context[N]>
  ): ReturnType<Context[N]>;

  $firstDOMNode: DOMNodeComponent | null;
  $firstHTMLELement: HTMLElementComponent | null;

  beginComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>
  ): T;
  endComponent(): void;
}

export type ToFullContext<C, Ev, I> = ComponentFuncs<C> &
  CustomContext<C, Ev> &
  DOMFuncs<C> &
  I;

export type Context<C = any, Ev = unknown> = ToFullContext<
  C,
  Ev,
  IntrinsicContext<C, Ev>
>;

export class ContextClass implements IntrinsicContext {
  get $() {
    return this.$view.eventRecevier ?? this.$cbComponent;
  }
  get $ev() {
    return this.$view.eventData;
  }
  constructor(public readonly $view: View) {}
  get $state() {
    return this.$view.state;
  }
  $cbComponent: any = null;

  $hookAfterThisComponent: null | (() => void) = null;
  protected callHookAfterThisComponent() {
    if (this.$hookAfterThisComponent) {
      this.$hookAfterThisComponent();
      this.$hookAfterThisComponent = null;
    }
  }

  $ref<C>(ref: Ref<C>) {
    this.$pendingRef = ref;
    return true;
  }
  $pendingRef: Ref<any> | null = null;

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

  $$(
    funcNameRaw: string | number,
    ...argsWithCKey: [ckey: string, ...args: any[]]
  ): any {
    const funcName = String(funcNameRaw);
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
    if (funcName.startsWith("_")) {
      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      let [ckey, data, inner] = argsWithCKey;
      inner = getD(inner);
      if (typeof inner === "string" || typeof inner === "number") {
        const text = inner;
        inner = () => {
          this.$$("_t", ckey, text);
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
        this.$classes
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
    ctor: ComponentConstructor<T>
  ) {
    this.callHookAfterThisComponent();

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
  endComponent() {
    this.$view.popKey();
  }

  renderHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    data: Partial<HTMLElementTagNameMap[E]>,
    inner: ViewRender,
    classes: string[]
  ) {
    this.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    let ec = this.$view.map.get(ikey) as HTMLElementComponent | undefined;
    const oldParent = this.$view.currrentParent;
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
        this.$view.currrentParent.children.push(ec);
        ec.children = [];
        this.$view.currrentParent = ec;
        inner(this as unknown as Context);
        break;
      case ViewState.recv:
        this.$view.currrentParent = ec!;
        inner(this as unknown as Context);
        break;
    }
    this.$view.currrentParent = oldParent;
    this.$view.popKey();
    return ec!;
  }
  renderText(ckey: string, text: string) {
    this.callHookAfterThisComponent();

    this.$view.pushKey(ckey);
    const ikey = this.$view.ikey;
    let t = this.$view.map.get(ikey) as DOMNodeComponent | undefined;
    if (this.$state === ViewState.update) {
      if (!t) {
        t = new DOMNodeComponent(ikey, document.createTextNode(text));
        this.$view.map.set(ikey, t);
      }
      this.$view.currrentParent.children.push(t);
      if (t.node.textContent !== text) t.node.textContent = text;
    }
    this.$view.popKey();
    return t!;
  }
}
