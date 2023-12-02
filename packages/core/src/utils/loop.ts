import { Prelude } from "../constants";
import { Context } from "../context";
import { D, getD } from "../data";

/**
 * Pick the keys of a object whose values are suitable for use as a key.
 */
type KeyHelper<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

/**
 * A function that generates a key for a item in a loop,
 *  or a key of `T` object whose values are suitable for use as a key.
 */
export type LoopKey<T> =
  | KeyHelper<T>
  | ((item: T, index: number) => D<string | number>);

/**
 * Normalize a key generator to a function.
 *
 * @param key The original key generator.
 * @returns A function that generates a key for a item in a loop.
 */
function normalizeKey<T>(key: LoopKey<T>) {
  return typeof key === "function" ? key : (obj: T) => `${obj[key]}`;
}

Prelude.registerFunc("for", function <
  T,
>(this: Context, ckey: string, iterable: D<Iterable<T>>, key: LoopKey<T>, body: (item: T, index: number) => void) {
  const ikey = this.$app.pushKey(ckey);

  const keyFunc = normalizeKey(key);
  let i = 0;
  for (const item of getD(iterable)) {
    const key = keyFunc(item, i);
    const innerIkey = this.$app.pushKey(key.toString());
    body(item, i);
    this.$app.popKey(innerIkey);
    i++;
  }

  this.$app.popKey(ikey);
  return false;
});

Prelude.registerFunc(
  "forTimes",
  function (ckey: string, times: D<number>, body: (index: number) => void) {
    const ikey = this.$app.pushKey(ckey);

    times = getD(times);
    for (let i = 0; i < times; i++) {
      const key = i.toString();
      const innerIkey = this.$app.pushKey(key);
      body(i);
      this.$app.popKey(innerIkey);
    }

    this.$app.popKey(ikey);
    return false;
  },
);

declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Loop over an iterable.
     *
     * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
     *  which does not update the Ikey stack,
     *  and will cause unexpected behavior.
     *  Use this function or `_.forTimes` instead.
     *
     * @param iterable The iterable to loop over.
     * @param key The key generator that generates a key for each item.
     * @param body The body of the loop.
     */
    for: never extends C["enabled"]
      ? <T = unknown>(
          iterable: D<Iterable<T>>,
          key: LoopKey<T>,
          body: (item: T, index: number) => void,
        ) => void
      : never;

    /**
     * Loop over a range of numbers. Similar to `for (let i = 0; i < times; i++)`.
     *
     * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
     *  which does not update the Ikey stack,
     *  and will cause unexpected behavior.
     *  Use this function or `_.for` instead.
     *
     * **Warning**: **DO NOT** use this function to loop over an array,
     *  because the key of each item will just be the index of the item,
     *  which may cause unexpected behavior.
     *
     * @param times The number of times to loop.
     * @param body The body of the loop.
     */
    forTimes: never extends C["enabled"]
      ? (times: D<number>, body: (index: number) => void) => void
      : never;
  }
}

/**
 * The key generator that use the index of the item as the key.
 *
 * **Note**: This key generator is usually used when the array is static.
 *
 * @example
 * ```ts
 * _.for([a, b, c], byIndex, (item, index) => {
 *   // ...
 * });
 * ```
 */
export const byIndex = (_item: any, index: number) => index;

/**
 * The key generator that use the item itself as the key.
 *
 * **Note**: Only array of string or number can use this key generator.
 */
export const bySelf = (item: D<string | number>) => `${item}`;
