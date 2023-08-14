import { contextFuncs } from "./context";
import { D, getD } from "./data";
import { View } from "./view";

declare module "./context" {
  interface CustomContext<C, Ev> {
    for: <T = unknown>(
      arr: D<Iterable<T>>,
      key: keyof T | ((item: T, index: number) => D<string>),
      body: (item: T, index: number) => void
    ) => void;
    forRange(times: D<number>, body: (index: number) => void): void;
    // for(
    //   times: number,
    //   body: (index: number) => void
    // ): void;
    // forEach<T = unknown>(
    //   arr: Iterable<T>,
    //   body: (item: T, index: number) => void
    // ): void;
  }
}
contextFuncs.for = <T>(
  view: View,
  ckey: string,
  arr: D<Iterable<T>>,
  key: keyof T | ((item: T, index: number) => D<string>),
  body: (item: T, index: number) => void
) => {
  view.pushKey(ckey);
  let k: any;
  if (typeof key === "string") {
    k = (item: T) => item[key];
  } else {
    k = key;
  }
  let i = 0;
  for (const item of getD(arr)) {
    view.pushKey(k(item, i));
    body(item, i);
    view.popKey();
    i++;
  }
  view.popKey();
  return false;
};
contextFuncs.forRange = <T>(
  view: View,
  ckey: string,
  times: D<number>,
  body: (index: number) => void
) => {
  view.pushKey(ckey);
  times = getD(times);
  for (let i = 0; i < times; i++) {
    view.pushKey(i.toString());
    body(i);
    view.popKey();
  }
  view.popKey();
  return false;
};

export const byIndex = (_: any, index: number) => index.toString();
export const bySelf = (item: any) => `${item}`;
