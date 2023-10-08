import { Context } from "./context";

export type View<Args extends any[] = []> = (
  context: Context,
  ...args: Args
) => void;

export function view<Args extends any[] = []>(view: View<Args>): View<Args> {
  return view;
}
