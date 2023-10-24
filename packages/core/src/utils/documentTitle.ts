import { D, getD } from "../data";
import { Prelude } from "../constants";

Prelude.register(
  "documentTitle",
  function (_ckey: string, title: D<string>): boolean {
    document.title = getD(title);
    return true;
  },
);

declare module "../context" {
  interface CustomContext<C> {
    documentTitle: never extends C ? (title: D<string>) => void : never;
  }
}
