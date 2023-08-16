import { View } from "./view";
import { Ref, getD } from "./data";
import { ComponentFuncs } from "./component";
import { DOMFuncs, DOMNodeComponent, HTMLElementComponent } from "./dom";

export const contextFuncs = {} as {
  [K in keyof CustomContext<any, unknown>]: K extends `$${string}`
    ? CustomContext<any, unknown>[K]
    : (
        view: View,
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

  // @ts-ignore
  $ref<C>(ref: Ref<C>): this is Context<C>;
  $pendingRef: Ref<any> | null;

  $cls(classes: string[]): void;
  $cls(strings: TemplateStringsArray, ...exps: any[]): void;
  readonly $classes: string[];

  $firstDOMNode: DOMNodeComponent | null;
  $firstHTMLELement: HTMLElementComponent | null;
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
    return this.$view.eventRecevierIkey;
  }
  get $ev() {
    return this.$view.eventData;
  }
  constructor(public readonly $view: View) {}

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

  protected $$(
    funcName: string,
    ...argsWithCKey: [ckey: string, ...args: any[]]
  ) {
    if (funcName === "_t") {
      // Now this is a text node
      const [ckey, text] = argsWithCKey;
      if (this.$classes.length > 0) {
        throw new Error(`Text node cannot have classes`);
      }
      const setFirstDOMNode = this.$firstDOMNode === null;
      const t = this.$view.renderText(ckey, getD(text));
      if (setFirstDOMNode) this.$firstDOMNode ??= t;
      return t;
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
      const ec = this.$view.renderHTMLElement(
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
    const func = contextFuncs[funcName];
    if (!func) {
      throw new Error(`Unknown element ${funcName}`);
    }
    return func.call(this, this.$view, ...argsWithCKey);
  }

  $firstDOMNode: DOMNodeComponent | null = null;
  $firstHTMLELement: HTMLElementComponent | null = null;
}
