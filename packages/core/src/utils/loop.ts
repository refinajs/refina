import { RefTreeNode } from "../app";
import { Prelude } from "../constants";
import { LowlevelContext } from "../context";

type AvaliableKeyImpl<T, K extends keyof T> = K extends any
  ? T[K] extends string | number
    ? K
    : never
  : never;

/**
 * Pick the keys of a object whose values are suitable for use as a key.
 */
type AvaliableKey<T> = AvaliableKeyImpl<T, keyof T>;

/**
 * A function that generates a key for a item in a loop,
 *  or a key of `T` object whose values are suitable for use as a key.
 */
export type LoopKey<T> =
  | AvaliableKey<T>
  | ((item: T, index: number) => string | number);

/**
 * Normalize a key generator to a function.
 *
 * @param key The original key generator.
 * @returns A function that generates a key for a item in a loop.
 */
function normalizeKey<T>(key: LoopKey<T>) {
  return typeof key === "function" ? key : (obj: T) => `${obj[key]}`;
}

type LoopRefTreeNodeMap = Record<string, RefTreeNode>;

Prelude.registerFunc("for", function <
  T,
>(this: LowlevelContext, ckey: string, iterable: Iterable<T>, key: LoopKey<T>, body: (item: T, index: number) => void) {
  this.$$currentRefTreeNode[ckey] ??= {};
  const refTreeNodes = this.$$currentRefTreeNode[ckey] as LoopRefTreeNodeMap;
  const parentRefTreeNode = this.$$currentRefTreeNode;

  const keyFunc = normalizeKey(key);
  let i = 0;
  for (const item of iterable) {
    const key = keyFunc(item, i).toString();

    refTreeNodes[key] ??= {};
    this.$$currentRefTreeNode = refTreeNodes[key];

    body(item, i);
    if (import.meta.env.DEV) {
      this.$$assertEmpty();
    }

    i++;
  }

  this.$$currentRefTreeNode = parentRefTreeNode;

  return false;
});

Prelude.registerFunc(
  "forTimes",
  function (ckey: string, times: number, body: (index: number) => void) {
    this.$$currentRefTreeNode[ckey] ??= {};
    const refTreeNodes = this.$$currentRefTreeNode[ckey] as LoopRefTreeNodeMap;
    const parentRefTreeNode = this.$$currentRefTreeNode;

    times = times;
    for (let i = 0; i < times; i++) {
      const key = i.toString();

      refTreeNodes[key] ??= {};
      this.$$currentRefTreeNode = refTreeNodes[key];

      body(i);
      if (import.meta.env.DEV) {
        this.$$assertEmpty();
      }
    }

    this.$$currentRefTreeNode = parentRefTreeNode;

    return false;
  },
);

declare module "../context/base" {
  interface ContextFuncs<C> {
    /**
     * Loop over an iterable.
     *
     * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
     *  which does not update $$currentRefTreeNode,
     *  and will cause unexpected behavior.
     *  Use this function or `_.forTimes` instead.
     *
     * @param iterable The iterable to loop over.
     * @param key The key generator that generates a key for each item.
     * @param body The body of the loop.
     */
    for: never extends C["enabled"]
      ? <T = unknown>(
          iterable: Iterable<T>,
          key: LoopKey<T>,
          body: (item: T, index: number) => void,
        ) => void
      : never;

    /**
     * Loop over a range of numbers. Similar to `for (let i = 0; i < times; i++)`.
     *
     * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
     *  which does not update the $$currentRefTreeNode,
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
      ? (times: number, body: (index: number) => void) => void
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
export const byIndex = (_item: unknown, index: number) => index;

/**
 * The key generator that use the item itself as the key.
 *
 * **Note**: Only array of string or number can use this key generator.
 */
export const bySelf = (item: string | number) => `${item}`;
