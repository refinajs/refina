import { $defineOutput } from "./component";
import type { Context, ContextDirectCallee } from "./context";

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
 * Define an output component by a view function.
 *
 * @example
 * ```ts
 * export default $view(_ => {
 *  // ...
 * });
 * ```
 *
 * @param view The view function.
 * @returns An output component.
 */
export function $view<Args extends any[] = []>(view: View<Args>) {
  const wrapped = $defineOutput(function (_) {
    return (...args: Args) => {
      view(_, ...args);
    };
  }) as ContextDirectCallee<(...args: Args) => void> & {
    $func: View<Args>;
  };
  wrapped.$func = view;
  return wrapped;
}
