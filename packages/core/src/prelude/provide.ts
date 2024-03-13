import { $contextFunc, Context, _ } from "../context";
import { Content } from "../dom";

type ProvideFuncType = {
  /**
   * Provide a value to `_.$runtimeData`
   *  for the duration of children.
   *
   * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
   *  which is not scoped to children.
   *
   * @param key The key of the value to provide.
   * @param value The value to provide.
   * @param content The content to render. In this content, `_.$runtimeData[key]` will be set to `value`.
   * @param args The arguments to pass to the content.
   *
   */
  (key: symbol, value: unknown, content: Content): void;
  /**
   * Provide a object of values to `_.$runtimeData`
   *  for the duration of children.
   *
   * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
   *  which is not scoped to children.
   *
   * @param obj The object of values to provide.
   * @param content The content to render. In this content, the values in obj is available in `_.$runtimeData`.
   * @param args The arguments to pass to the content.
   */
  (obj: Record<symbol, unknown>, content: Content): void;
};

export const provide = $contextFunc(
  (_ckey): ProvideFuncType =>
    (keyOrObj, ...rest: any[]) => {
      if (typeof keyOrObj === "symbol") {
        const key = keyOrObj,
          [value, content] = rest as [unknown, Content<any>];
        const oldVal = _.$runtimeData[key];
        _.$runtimeData[key] = value;
        _.embed(content, _);
        _.$runtimeData[key] = oldVal;
      } else {
        const obj = keyOrObj,
          [content, ...args] = rest as [Content<any>, ...any];
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
    },
);
