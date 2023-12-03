import { OutputComponent } from "../component";
import { Prelude } from "../constants";
import { Context } from "../context";
import { D } from "../data";
import { Content } from "../dom";

@Prelude.outputComponent("provide")
export class Provide extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    key: symbol,
    value: any,
    content: D<Content<Args>>,
    ...args: Args
  ): void;
  main<Args extends any[]>(
    _: Context,
    obj: Record<symbol, any>,
    content: D<Content<Args>>,
    ...args: Args
  ): void;
  main<Args extends any[]>(
    _: Context,
    keyOrObj: symbol | Record<symbol, any>,
    contentOrValue: any,
    content: D<Content<Args>>,
    ...args: Args
  ): void {
    if (typeof keyOrObj === "symbol") {
      const key = keyOrObj,
        value = contentOrValue;
      const oldVal = _.$runtimeData[key];
      _.$runtimeData[key] = value;
      _.embed(content, ...args);
      _.$runtimeData[key] = oldVal;
    } else {
      const obj = keyOrObj;
      const symbols = Object.getOwnPropertySymbols(obj);
      const oldVals: Record<symbol, any> = {};
      for (const key of symbols) {
        oldVals[key] = _.$runtimeData[key];
        _.$runtimeData[key] = obj[key];
      }
      _.embed(content, ...args);
      for (const key of symbols) {
        _.$runtimeData[key] = oldVals[key];
      }
    }
  }
}

declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Provide a value or a object of values to `_.$runtimeData`
     *  for the duration of the inner content.
     *
     * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
     *  which is not scoped to the inner content.
     *
     * ---
     *
     * *Overload 1*:
     *
     * @param key The key of the value to provide.
     * @param value The value to provide.
     * @param content The content to render. In this content, `_.$runtimeData[key]` will be set to `value`.
     * @param args The arguments to pass to the content.
     *
     * ---
     *
     * *Overload 2*:
     *
     * @param obj The object of values to provide.
     * @param content The content to render. In this content, the values in obj is available in `_.$runtimeData`.
     * @param args The arguments to pass to the content.
     */
    provide: Provide extends C["enabled"]
      ? (<Args extends any[]>(
          key: symbol,
          value: any,
          content: D<Content<Args>>,
          ...args: Args
        ) => void) &
          (<Args extends any[]>(
            obj: Record<symbol, any>,
            content: D<Content<Args>>,
            ...args: Args
          ) => void)
      : never;
  }
}
