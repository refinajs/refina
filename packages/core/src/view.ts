import { Context } from "./context";

/**
 * The type of a view function.
 *
 * View is a function that takes a context and some arguments,
 *  and renders the content of the component.
 *
 * **Note**: The main difference between a view and a component is that
 *  a view does not have a class and has no state.
 */
export type View<Args extends any[] = []> = (
  context: Context,
  ...args: Args
) => void;

/**
 * Define a view function with type checking.
 *
 * @example
 * ```ts
 * export default defineView(_ => {
 *  // ...
 * });
 * ```
 *
 * @param view The view function.
 * @returns The view function itself.
 */
export function defineView<Args extends any[] = []>(
  view: View<Args>,
): View<Args> {
  return view;
}
