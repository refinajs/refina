import type { RefTreeNode } from "../app";
import { $contextFunc, _ } from "../context";

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

export const _for = $contextFunc(ckey =>
  /**
   * Loop over an iterable.
   *
   * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
   *  which does not update $$currentRefNode,
   *  and will cause unexpected behavior.
   *  Use this function or `_.forTimes` instead.
   *
   * @param iterable The iterable to loop over.
   * @param key The key generator that generates a key for each item.
   * @param body The body of the loop.
   */
  <T = unknown>(iterable: Iterable<T>, key: LoopKey<T>, body: (item: T, index: number) => void): void => {
    const context = _.$lowlevel;
    const parentRefNode = context.$$currentRefNode;
    const refTreeNodes = (parentRefNode[ckey] ??= {}) as LoopRefTreeNodeMap;

    const keyFunc = normalizeKey(key);
    let i = 0;
    for (const item of iterable) {
      const key = keyFunc(item, i).toString();

      refTreeNodes[key] ??= {};
      context.$$currentRefNode = refTreeNodes[key];

      body(item, i);
      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }

      i++;
    }

    context.$$currentRefNode = parentRefNode;
  },
);

export const forTimes = $contextFunc(ckey =>
  /**
   * Loop over a range of numbers. Similar to `for (let i = 0; i < times; i++)`.
   *
   * **Warning**: **DO NOT** use `for` or `while` statement in Refina,
   *  which does not update the $$currentRefNode,
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
  (times: number, body: (index: number) => void): void => {
    const context = _.$lowlevel;
    const parentRefNode = context.$$currentRefNode;
    const refTreeNodes = (parentRefNode[ckey] ??= {}) as LoopRefTreeNodeMap;

    for (let i = 0; i < times; i++) {
      const key = i.toString();

      refTreeNodes[key] ??= {};
      context.$$currentRefNode = refTreeNodes[key];

      body(i);
      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }
    }

    context.$$currentRefNode = parentRefNode;
  },
);

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
