import type { App } from "./app";
import { Component, ComponentConstructor, ComponentFuncs } from "./component";
import { AppState } from "./constants";
import { D, Ref, getD, mergeRefs } from "./data";
import {
  Content,
  DOMElementComponent,
  DOMFuncs,
  DOMNodeComponent,
  SVGElementFuncData,
  TextNodeComponent,
  createCbHTMLElementComponentFunction,
} from "./dom";
import { Maybe } from "./utils";
import { View } from "./view";

export type CustomContextFuncs = {
  [K in keyof CustomContext<any>]: K extends `$${string}`
    ? CustomContext<any>[K]
    : CustomContext<any>[K] extends (...args: any) => any
    ? (
        this: Context,
        ckey: string,
        ...args: Parameters<CustomContext<any>[K]>
      ) => ReturnType<CustomContext<any>[K]>
    : never;
} & {
  [K in keyof ComponentFuncs<any>]: (
    this: Context,
    ckey: string,
    ...args: Parameters<ComponentFuncs<any>[K]>
  ) => ReturnType<ComponentFuncs<any>[K]>;
};

export interface CustomContext<C> {}

export type ToFullContext<C, I> = I &
  DOMFuncs<C> &
  ComponentFuncs<C> &
  CustomContext<C>;

export class IntrinsicContext<C> {
  constructor(public readonly $app: App) {
    $app.callPermanentHook("initializeContext", this as unknown as Context);
  }

  get $update() {
    return this.$app.update;
  }

  get $getD() {
    return getD;
  }
  get $setD() {
    return this.$app.setD;
  }

  $setMaybe<T extends {}>(m: Maybe<T>, value: T) {
    m.value = value;
    this.$update();
  }
  $clearMaybe(m: Maybe<any>) {
    m.clear();
    this.$update();
  }

  get $state() {
    return this.$app.state;
  }
  get $updating() {
    return this.$state === AppState.update;
  }
  get $receiving() {
    return this.$state === AppState.recv;
  }

  get $() {
    return this.$app.eventRecevierRef ?? this.$cbComponent;
  }
  get $ev() {
    return this.$app.eventData;
  }

  get $root() {
    return this.$app.root;
  }

  $cbComponent: C = null as any;

  $pendingRef: Ref<any> | null = null;
  $ref<C2>(ref: Ref<C2>, ...refs: Ref<C2>[]): this is Context<C2> {
    this.$pendingRef = refs.length === 0 ? ref : mergeRefs(ref, ...refs);
    return true;
  }
  $setRef(current: any) {
    if (this.$pendingRef !== null) {
      this.$pendingRef.current = current;
      this.$pendingRef = null;
    }
  }

  $mainEl: HTMLElement | null = null;
  protected $isNextNodeMain = false;
  $main(): true {
    this.$isNextNodeMain = true;
    return true;
  }
  protected $setMainEl(node: HTMLElement | null) {
    if (this.$isNextNodeMain) {
      this.$mainEl = node;
      this.$isNextNodeMain = false;
    }
  }

  $noPreserve(deep: boolean = true): true {
    this.$pendingNoPreserve = deep ? "deep" : true;
    return true;
  }
  $pendingNoPreserve: boolean | "deep" = false;
  $allNoPreserve = false;
  get $isNoPreserve() {
    return Boolean(this.$allNoPreserve || this.$pendingNoPreserve);
  }

  $cls(cls: string): true;
  $cls(template: TemplateStringsArray, ...args: any[]): true;
  $cls(...args: any[]): true {
    this.$pendingCls = this.$pendingCls.concat(
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]
      )
        .split(/\s/)
        .filter(Boolean),
    );
    return true;
  }
  protected $pendingCls: string[] = [];
  get $clsToApply() {
    const classes = this.$pendingCls;
    this.$pendingCls = [];
    return classes;
  }

  $css(style: string): true;
  $css(template: TemplateStringsArray, ...args: any[]): true;
  $css(...args: any[]): true {
    this.$pendingCSS +=
      ";" +
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]);
    return true;
  }
  protected $pendingCSS: string = "";
  get $cssToApply() {
    const style = this.$pendingCSS;
    this.$pendingCSS = "";
    return style;
  }

  $rootCls(cls: string): true;
  $rootCls(template: TemplateStringsArray, ...args: any[]): true;
  $rootCls(...args: any[]): true {
    this.$app.pendingRootCls = this.$app.pendingRootCls.concat(
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]
      )
        .split(/\s/)
        .filter(Boolean),
    );
    return true;
  }

  $rootCss(style: string): void;
  $rootCss(template: TemplateStringsArray, ...args: any[]): void;
  $rootCss(...args: any[]): void {
    this.$app.pendingRootCSS +=
      ";" +
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]);
  }

  get $permanentData() {
    return this.$app.permanentData;
  }
  get $runtimeData() {
    return this.$app.runtimeData!;
  }

  $customData: Record<symbol, any> = {};

  $$(funcName: string, ckey: string, ...args: any[]): any {
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
    if (
      funcName.startsWith("_svg") &&
      funcName[4].toUpperCase() === funcName[4]
    ) {
      // Now this is a SVG element
      const tagName = (funcName[4].toLowerCase() +
        funcName.slice(5)) as keyof SVGElementTagNameMap;
      let [data, inner] = args;
      this.$processSVGElement(
        ckey,
        tagName,
        this.$clsToApply,
        this.$cssToApply,
        data,
        inner,
      );
      return;
    }
    if (funcName[0] === "_") {
      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      const [data, inner] = args;
      this.$processHTMLElement(
        ckey,
        tagName,
        this.$clsToApply,
        this.$cssToApply,
        data,
        inner,
      );
      return;
    }
    // Now this is a user-defined component
    const func = this.$app.getCustomContextFunc(
      funcName as keyof CustomContextFuncs,
    );
    if (!func) {
      throw new Error(`Unknown element ${funcName}`);
    }
    //@ts-ignore
    return func.call(this as unknown as Context, ckey, ...args);
  }

  $$t(ckey: string, text: D<string>): any {
    if (this.$clsToApply.length > 0) {
      throw new Error(`Text node cannot have classes`);
    }
    if (this.$cssToApply.length > 0) {
      throw new Error(`Text node cannot have style`);
    }
    return this.$processTextNode(ckey, getD(text));
  }

  $firstDOMNode: DOMNodeComponent | null = null;
  $setFirstDOMNode(node: DOMNodeComponent) {
    this.$firstDOMNode ??= node;
  }
  $firstHTMLELement: DOMElementComponent | null = null;
  $setFirstHTMLELement(element: DOMElementComponent) {
    this.$firstHTMLELement ??= element;
  }

  $beginComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
  ) {
    this.$app.callAndResetHook("afterThisComponent");

    const ikey = this.$app.pushKey(ckey);
    this.$app.markComponentProcessed(ikey);
    let component = this.$app.refMap.get(ikey) as T;
    if (!component) {
      component = new ctor(ikey, this.$app);
      this.$app.refMap.set(ikey, component);
    }

    this.$setRef(component);

    if (this.$isNoPreserve) {
      this.$app.noPreserveComponents.add(ikey);
      // later set by IntrinsicComponentContext:
      //   this.$pendingNoPreserve = false;
    }
    return component;
  }
  $endComponent(component: Component, ckey: string) {
    this.$setMainEl(component.$mainEl);
    this.$app.popKey(ckey);
  }

  protected $normalizeContent(content: D<Content> = () => {}): View {
    const contentValue = getD(content);
    if (typeof contentValue === "string" || typeof contentValue === "number") {
      const text = contentValue;
      return () => {
        if (this.$clsToApply.length > 0) {
          throw new Error(`Text node cannot have classes`);
        }
        if (this.$cssToApply.length > 0) {
          throw new Error(`Text node cannot have style`);
        }
        this.$processTextNode("_t", String(text));
      };
    }
    return contentValue;
  }

  protected $processHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    classes: string[],
    style: string,
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: D<Content>,
  ) {
    data ??= {};
    inner = this.$normalizeContent(inner);

    this.$app.callAndResetHook("afterThisComponent");

    const ikey = this.$app.pushKey(ckey);

    let ec = this.$app.refMap.get(ikey) as DOMElementComponent | undefined;
    if (!ec) {
      ec = new DOMElementComponent<keyof HTMLElementTagNameMap>(
        ikey,
        document.createElement(tagName),
      );
      this.$app.refMap.set(ikey, ec);
      this.$app.nodeMap.set(ec.node, ec);
    }

    if (this.$updating) {
      for (const key in data) {
        if (data[key] === undefined) {
          // @ts-ignore
          delete ec.node[key];
        } else {
          // @ts-ignore
          ec.node[key] = data[key];
        }
      }
      ec.setClasses(classes);
      ec.setStyle(style);
    }

    this.$setRef(ec);
    this.$setMainEl(ec.$mainEl);
    this.$setFirstDOMNode(ec!);
    this.$setFirstHTMLELement(ec!);
    this.$app.markComponentProcessed(ikey);

    const context = new IntrinsicContext(this.$app);

    if (this.$isNoPreserve) {
      this.$app.noPreserveComponents.add(ikey);
      if (this.$pendingNoPreserve === "deep") context.$allNoPreserve = true;
      this.$pendingNoPreserve = false;
    }

    const oldParent = this.$app.currentDOMParent;
    oldParent.children.push(ec);
    ec.children = [];
    this.$app.currentDOMParent = ec!;

    inner(context as unknown as Context);
    this.$app.callAndResetHook("afterThisComponent");

    this.$app.currentDOMParent = oldParent;

    this.$app.popKey(ckey);
    return ec!;
  }
  protected $processSVGElement<E extends keyof SVGElementTagNameMap>(
    ckey: string,
    tagName: E,
    classes: string[],
    style: string,
    data?: SVGElementFuncData,
    inner?: D<Content>,
  ) {
    data ??= {};
    inner = this.$normalizeContent(inner);

    this.$app.callAndResetHook("afterThisComponent");

    const ikey = this.$app.pushKey(ckey);

    let ec = this.$app.refMap.get(ikey) as DOMElementComponent | undefined;
    if (!ec) {
      ec = new DOMElementComponent<keyof SVGElementTagNameMap>(
        ikey,
        document.createElementNS("http://www.w3.org/2000/svg", tagName),
      );
      this.$app.refMap.set(ikey, ec);
      this.$app.nodeMap.set(ec.node, ec);
    }

    if (this.$updating) {
      for (const key in data) {
        const value = data[key];
        if (value === undefined) {
          ec.node.removeAttribute(key);
        } else {
          if (typeof value === "function") {
            //@ts-ignore
            ec.node[key] = value;
          } else {
            ec.node.setAttribute(key, String(value));
          }
        }
      }
      ec.setClasses(classes);
      ec.setStyle(style);
    }

    this.$setRef(ec);
    this.$setMainEl(ec.$mainEl);
    this.$setFirstDOMNode(ec!);
    this.$setFirstHTMLELement(ec!);
    this.$app.markComponentProcessed(ikey);

    const context = new IntrinsicContext(this.$app);

    if (this.$isNoPreserve) {
      this.$app.noPreserveComponents.add(ikey);
      if (this.$pendingNoPreserve === "deep") context.$allNoPreserve = true;
      this.$pendingNoPreserve = false;
    }

    const oldParent = this.$app.currentDOMParent;
    oldParent.children.push(ec);
    ec.children = [];
    this.$app.currentDOMParent = ec!;

    inner(context as unknown as Context);
    this.$app.callAndResetHook("afterThisComponent");

    this.$app.currentDOMParent = oldParent;

    this.$app.popKey(ckey);
    return ec!;
  }
  protected $processTextNode(ckey: string, text: string) {
    this.$app.callAndResetHook("afterThisComponent");

    const ikey = this.$app.pushKey(ckey);
    let t = this.$app.refMap.get(ikey) as DOMNodeComponent | undefined;
    if (!t) {
      t = new TextNodeComponent(ikey, document.createTextNode(text));
      this.$app.refMap.set(ikey, t);
      this.$app.nodeMap.set(t.node, t);
    } else if (this.$updating && t.node.textContent !== text) {
      t.node.textContent = text;
    }

    this.$setRef(t);
    this.$setMainEl(null);
    this.$setFirstDOMNode(t);
    this.$app.markComponentProcessed(ikey);

    if (this.$allNoPreserve || this.$pendingNoPreserve) {
      this.$app.noPreserveComponents.add(ikey);
      this.$pendingNoPreserve = false;
    }

    this.$app.currentDOMParent.children.push(t);

    this.$app.popKey(ckey);
    return t!;
  }
}

export type Context<C = any> = ToFullContext<
  C,
  Omit<IntrinsicContext<C>, "$" | "$ev">
>;
