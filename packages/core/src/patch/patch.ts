import { DOMElementEventListenersInfoRaw } from "../dom";

export interface PatchTarget<T = HTMLElement> {
  setProps(props: Partial<T>): this;

  setAttrs(attrs: Partial<T>): this;

  addCls(cls: string): this;
  resetCls(cls: string): this;

  addCss(css: string): this;
  resetCss(css: string): this;

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this;

  get patchData(): {
    props: Partial<T>;
    attrs: Partial<T>;
    resetCls: boolean;
    cls: string;
    resetCss: boolean;
    css: string;
    eventListeners: DOMElementEventListenersInfoRaw;
  };
}

export function createPatchTarget<T = HTMLElement>(): PatchTarget<T> {
  const props: Partial<T> = {};
  const attrs: Partial<T> = {};
  let resetCls = false;
  let cls = "";
  let resetCss = false;
  let css = "";
  const eventListeners: DOMElementEventListenersInfoRaw = {};
  return {
    setProps(value) {
      Object.assign(props, value);
      return this;
    },
    setAttrs(value) {
      Object.assign(attrs, value);
      return this;
    },
    addCls(value) {
      cls += value + " ";
      return this;
    },
    resetCls(value) {
      resetCls = true;
      cls = value + " ";
      return this;
    },
    addCss(value) {
      css += value + ";";
      return this;
    },
    resetCss(value) {
      resetCss = true;
      css = value + ";";
      return this;
    },
    addEventListener(type, listener, options) {
      (eventListeners as any)[type] = { listener, options };
      return this;
    },
    get patchData() {
      return {
        props,
        attrs,
        resetCls,
        cls,
        resetCss,
        css,
        eventListeners,
      };
    },
  };
}

const doNothing = function (this: unknown) {
  return this;
};
export const emptyPatchTarget = {
  setProps: doNothing,
  setAttrs: doNothing,
  addCls: doNothing,
  resetCls: doNothing,
  addCss: doNothing,
  resetCss: doNothing,
  addEventListener: doNothing,
  get patchData(): never {
    throw new Error("emptyPatchTarget");
  },
} as PatchTarget<any>;
