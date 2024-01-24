import { Context } from "../context";

export type Fragment<Args extends [any, ...any[]] = [_: Context]> = (
  ...args: Args
) => void;

/**
 * Allowed content types of DOM element components.
 */
export type Content<Args extends [any, ...any[]] = [_: Context]> =
  | string
  | number
  | Fragment<Args>;

/**
 * Bind arguments to content if the content is a fragment.
 *
 * @example
 * ```ts
 * const content: Content<[string]> = ...;
 * const boundContent: Content = bindArgsToContent(content, "Hello, world!");
 * _.div(boundContent);
 * ```
 *
 * @param content The content to bind arguments to.
 * @param args The arguments to bind.
 * @returns The bound content.
 */
export function bindArgsToContent<Args extends [any, ...any[]]>(
  content: Content<Args>,
  ...args: Args
) {
  if (typeof content === "function") {
    return () => content(...args);
  }
  return content;
}
