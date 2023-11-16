import { D, getD } from "../data";
import { Prelude } from "../constants";

Prelude.registerFunc(
  "documentTitle",
  function (_ckey: string, title: D<string>): boolean {
    document.title = getD(title);
    return true;
  },
);

declare module "../context" {
  interface ContextFuncs<C> {
    documentTitle: never extends C["enabled"]
      ? (title: D<string>) => void
      : never;
  }
}
