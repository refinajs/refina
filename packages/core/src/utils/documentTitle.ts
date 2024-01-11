import { Prelude } from "../constants";

Prelude.registerFunc(
  "documentTitle",
  function (_ckey: string, title: string): boolean {
    if (this.$updateContext) {
      document.title = title;
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
    documentTitle: never extends C["enabled"] ? (title: string) => void : never;
  }
}
