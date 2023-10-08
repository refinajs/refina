import { App, AppState } from "./app";
import {
  Component,
  ComponentConstructor,
  ComponentFuncs,
} from "./component/index";
import { D, Ref, getD, mergeRefs } from "./data/index";
import {
  Content,
  DOMElementComponent,
  DOMFuncs,
  DOMNodeComponent,
  TextNodeComponent,
  createCbHTMLElementComponentFunction,
} from "./dom";
import { Maybe } from "./utils/index";

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
};

declare global {
  interface Window {
    __CONTEXT_FUNCS__: CustomContextFuncs;
  }
}

export function addCustomContextFunc<N extends keyof CustomContextFuncs>(
  name: N,
  func: CustomContextFuncs[N] & ThisType<Context>,
) {
  window.__CONTEXT_FUNCS__ ??= {} as any;
  window.__CONTEXT_FUNCS__[name] = func;
}

export function getCustomContextFunc<N extends keyof CustomContextFuncs>(
  name: N,
): CustomContextFuncs[N] {
  return window.__CONTEXT_FUNCS__[name];
}

export interface CustomContext<C> {}

export type ToFullContext<C, I> = ComponentFuncs<C> &
  CustomContext<C> &
  DOMFuncs<C> &
  I;

function updateElementAttribute(
  element: Pick<HTMLElement, "setAttribute" | "removeAttribute"> &
    Record<string, any>,
  data: Record<string, any>,
) {
  for (const key in data) {
    const value = data[key];
    if (value === undefined) {
      element.removeAttribute(key);
    } else if (typeof value === "string") {
      element.setAttribute(key, String(value));
    } else {
      //@ts-ignore
      element[key] = value;
    }
  }
}

export class IntrinsicContext<C> {
  constructor(public readonly $app: App) {
    Object.defineProperty(this, "$ev", {
      get() {
        return $app.eventData;
      },
    });
    Object.defineProperty(this, "$", {
      get() {
        return this.$app.eventRecevier ?? this.$cbComponent;
      },
    });
  }

  $update() {
    this.$app.update();
  }

  $setD<T>(d: D<T>, v: T): boolean {
    return this.$app.setD(d, v);
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
  get $router() {
    return this.$app.router;
  }
  $cbComponent: C = null as any;

  $preventDefault(): true {
    const ev = this.$app.eventData;
    if (typeof ev?.preventDefault !== "function") {
      throw new Error(`Cannot prevent default on ${ev}.`);
    }
    ev.preventDefault();
    return true;
  }
  $stopPropagation(): true {
    const ev = this.$app.eventData;
    if (typeof ev?.stopPropagation !== "function") {
      throw new Error(`Cannot stop propagation on ${ev}.`);
    }
    ev.stopPropagation();
    return true;
  }
  $stopImmediatePropagation(): true {
    const ev = this.$app.eventData;
    if (typeof ev?.stopImmediatePropagation !== "function") {
      throw new Error(`Cannot stop immediate propagation on ${ev}.`);
    }
    ev.stopImmediatePropagation();
    return true;
  }

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

  get $permanentData() {
    return this.$app.permanentData;
  }
  protected get $runtimeData() {
    return this.$app.runtimeData!;
  }
  $provide(key: symbol, value: unknown): true {
    this.$runtimeData[key] = value;
    return true;
  }
  $unprovide(key: symbol): true {
    delete this.$runtimeData[key];
    return true;
  }
  $forceInject<T>(key: symbol, errorMessage?: string): T {
    if (!(key in this.$runtimeData)) {
      throw new Error(
        errorMessage ?? `Cannot inject ${key.toString()}: not provided.`,
      );
    }
    return this.$runtimeData[key];
  }
  $inject<T>(key: symbol, fallback?: T): T {
    return this.$runtimeData[key] ?? fallback;
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
      return this.$processSVGElement(
        ckey,
        tagName,
        this.$clsToApply,
        this.$cssToApply,
        data,
        inner,
      );
    }
    if (funcName[0] === "_") {
      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      const [data, inner] = args;
      return this.$processHTMLElement(
        ckey,
        tagName,
        this.$clsToApply,
        this.$cssToApply,
        data,
        inner,
      );
    }
    // Now this is a user-defined component
    const func = getCustomContextFunc(funcName as keyof CustomContextFuncs);
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
  $endComponent(ckey: string) {
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
      updateElementAttribute(ec.node, data);
      ec.setClasses(classes);
      ec.setStyle(style);
    }

    this.$setRef(ec);
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
    data?: Partial<SVGElementTagNameMap[E]>,
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
      updateElementAttribute(ec.node, data);
      ec.setClasses(classes);
      ec.setStyle(style);
    }

    this.$setRef(ec);
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

export type Context<C = any> = ToFullContext<C, IntrinsicContext<C>>;

export type View<Args extends any[] = []> = (
  context: Context,
  ...args: Args
) => void;

export function view<Args extends any[] = []>(view: View<Args>): View<Args> {
  return view;
}

export class IntrinsicAppContext<C> extends IntrinsicContext<C> {
  $rootCls(cls: string): true;
  $rootCls(template: TemplateStringsArray, ...args: any[]): true;
  $rootCls(...args: any[]): true {
    this.$app.root.setClasses(
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
    this.$app.root.setStyle(
      Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0],
    );
  }
}

export type AppContext<C = any> = ToFullContext<C, IntrinsicAppContext<C>>;

export type AppView = (_: AppContext) => void;
