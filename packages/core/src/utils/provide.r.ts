import { Prelude } from "../constants";
import { D } from "../data";
import { Content } from "../dom";

declare module "../component" {
  interface Components {
    /**
     * Provide a value to `_.$runtimeData`
     *  for the duration of the inner content.
     *
     * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
     *  which is not scoped to the inner content.
     *
     * @param key The key of the value to provide.
     * @param value The value to provide.
     * @param content The content to render. In this content, `_.$runtimeData[key]` will be set to `value`.
     * @param args The arguments to pass to the content.
     *
     */
    provide<Args extends any[]>(
      key: symbol,
      value: unknown,
      content: D<Content<Args>>,
      ...args: Args
    ): void;
    /**
     * Provide a object of values to `_.$runtimeData`
     *  for the duration of the inner content.
     *
     * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
     *  which is not scoped to the inner content.
     *
     * @param obj The object of values to provide.
     * @param content The content to render. In this content, the values in obj is available in `_.$runtimeData`.
     * @param args The arguments to pass to the content.
     */
    provide<Args extends any[]>(
      obj: Record<symbol, unknown>,
      content: D<Content<Args>>,
      ...args: Args
    ): void;
  }
}

Prelude.outputComponents.provide = function (_) {
  return (keyOrObj, ...rest) => {
    if (typeof keyOrObj === "symbol") {
      const key = keyOrObj,
        [value, content, ...args] = rest as [
          unknown,
          D<Content<any[]>>,
          ...any[],
        ];
      const oldVal = _.$runtimeData[key];
      _.$runtimeData[key] = value;
      _.embed(content, ...args);
      _.$runtimeData[key] = oldVal;
    } else {
      const obj = keyOrObj,
        [content, ...args] = rest as [D<Content<any[]>>, ...any[]];
      const symbols = Object.getOwnPropertySymbols(obj);
      const oldVals: Record<symbol, unknown> = {};
      for (const key of symbols) {
        oldVals[key] = _.$runtimeData[key];
        _.$runtimeData[key] = obj[key];
      }
      _.embed(content, ...args);
      for (const key of symbols) {
        _.$runtimeData[key] = oldVals[key];
      }
    }
  };
};
