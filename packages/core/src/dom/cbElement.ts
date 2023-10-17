import {
  CallbackComponent,
  ComponentContext,
  ToCallbackComponentFuncs,
  createCallbackComponentFunc,
} from "../component";
import { Context } from "../context";
import { D } from "../data";
import { Content } from "./base";

export function createCbHTMLElementComponentFunction<
  E extends keyof HTMLElementTagNameMap,
>(tagName: E) {
  const ctor = class
    extends CallbackComponent<HTMLElementEventMap>
    implements CbHTMLElementComponent<E>
  {
    main(
      _: ComponentContext<this>,
      data: Partial<HTMLElementTagNameMap[E]> = {},
      inner: D<Content> = () => {},
    ) {
      const elementData: any = { ...data };
      for (const ev of this.$listendEvs) {
        elementData[`on${ev}`] = this.$firer(ev);
      }
      (
        _.$$ as (
          funcName: string,
          ckey: string,
          data?: Partial<HTMLElementTagNameMap[E]>,
          inner?: D<Content>,
          //@ts-ignore
        ) => this is Context<DOMElementComponent<E>>
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
      createCbHTMLElementComponentFunction(tagName),
    );
  }
  return cbHTMLElementComponentFunctionCache.get(tagName)!;
}

export interface CbHTMLElementComponent<E extends keyof HTMLElementTagNameMap>
  extends CallbackComponent<HTMLElementEventMap> {
  main(
    _: ComponentContext<this>,
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: D<Content>,
  ): void;
}

export type CbHTMLElementFuncs<C> = ToCallbackComponentFuncs<
  {
    [E in keyof HTMLElementTagNameMap as `_cb${Capitalize<E>}`]: CbHTMLElementComponent<E>;
  },
  C
>;
