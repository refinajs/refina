import { View } from "./view";
import { Ref, getD } from "./data";
import { ComponentFuncs } from "./component";
import { DOMFuncs } from "./htmlElements";

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
export interface CustomContext<C, Ev> extends CustomContextFuncsBase {}

export interface IntrinsicContext<C = any, Ev = unknown> {
  readonly $: C;
  readonly $ev: Ev;
  readonly $view: View;

  // @ts-ignore
  $ref<C>(ref: Ref<C>): this is Context<C>;

  $pendingRef: Ref<C> | null;
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

export class ContextClass implements Partial<IntrinsicContext> {
  constructor(public readonly $view: View) {}

  $$(funcName: string, ...argsWithCKey: [ckey: string, ...args: any[]]) {
    if (funcName.startsWith("_")) {
      if (funcName === "_t") {
        const [ckey, text] = argsWithCKey;
        return this.$view.renderText(ckey, getD(text));
      }

      // Now this is a HTML element
      const tagName = funcName.slice(1) as keyof HTMLElementTagNameMap;
      let [ckey, data, inner] = argsWithCKey;
      if (typeof inner === "string") {
        const text = inner;
        inner = () => {
          this.$$("_t", ckey, text);
        };
      }
      inner ??= () => {};
      return this.$view.renderHTMLElement(ckey, tagName, data, inner);
    }
    const func = contextFuncs[funcName];
    if (func) {
      return func(this.$view, ...argsWithCKey);
    }
    throw new Error(`Unknown element ${funcName}`);
  }

  get $ev() {
    return this.$view.eventData;
  }
  $ref<C>(ref: Ref<C>) {
    this.$pendingRef = ref;
    return true;
  }
  $pendingRef: Ref<any> | null = null;
}
