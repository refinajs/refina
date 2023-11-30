import { Context } from "../context";
import { D, getD } from "../data";
import { View } from "../view";

/**
 * Allowed content types of DOM element components.
 */
export type Content<Args extends any[] = []> = string | number | View<Args>;

/**
 * Bind arguments to content if the content is a view function.
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
export function bindArgsToContent<Args extends any[]>(
  content: D<Content<Args>>,
  ...args: Args
) {
  const contentValue = getD(content);
  if (typeof contentValue === "function") {
    return (ctx: Context) => contentValue(ctx, ...args);
  }
  return contentValue;
}
