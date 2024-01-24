import type { RefTreeNode } from "../app";
import { Context, _ } from "../context";
import type { Fragment } from "./content";

/**
 * Define a view from a fragment.
 *
 * @example
 * ```ts
 * export default $view(_ => {
 *  // ...
 * });
 * ```
 *
 * @param fragment The fragment.
 * @returns An output component.
 */
export function $view<Args extends [any, ...any[]] = [_: Context]>(
  fragment: Fragment<Args>,
): {
  (ckey: string): (...args: Args) => void;
  $func: Fragment<Args>;
} {
  const ret =
    (ckey: string) =>
    (...args: Args) => {
      const context = _.$lowlevel;

      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }

      const parentNode = context.$$currentRefNode;
      context.$$currentRefNode = (parentNode[ckey] ??= {}) as RefTreeNode;
      try {
        fragment(...args);
      } catch (e) {
        context.$app.callHook("onError", e);
      }
      context.$$currentRefNode = parentNode;

      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }
    };
  ret.$func = fragment;
  return ret;
}
