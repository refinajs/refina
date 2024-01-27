import { Context } from "../context";

export type View<Args extends [any, ...any[]] = [_: Context]> = (
  ...args: Args
) => void;

export function $view<Args extends [any, ...any[]] = [_: Context]>(
  view: View<Args>,
) {
  return view;
}
