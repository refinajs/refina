import { Prelude } from "../constants";
import { D, getD } from "../data";

Prelude.registerFunc(
  "documentTitle",
  function (_ckey: string, title: D<string>): boolean {
    if (this.$updateState) {
      document.title = getD(title);
    }
    return true;
  },
);

declare module "../context/base" {
  interface ContextFuncs<C> {
    /**
     * Set the document title.
     *
     * **Warning**: The document title will be overwritten by the last call to this function.
     */
    documentTitle: never extends C["enabled"]
      ? (title: D<string>) => void
      : never;
  }
}
