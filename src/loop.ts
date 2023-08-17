import { Context, contextFuncs } from "./context";
import { D, getD } from "./data";

declare module "./context" {
  interface CustomContext<C> {
    for: <T = unknown>(
      arr: D<Iterable<T>>,
      key: keyof T | ((item: T, index: number) => D<string>),
      body: (item: T, index: number) => void,
    ) => void;
    forRange(times: D<number>, body: (index: number) => void): void;
  }
}
contextFuncs.for = function <T>(
  this: Context,
  ckey: string,
  arr: D<Iterable<T>>,
  key: keyof T | ((item: T, index: number) => D<string>),
  body: (item: T, index: number) => void,
) {
  this.$view.pushKey(ckey);
  let k: any;
  if (typeof key === "string") {
    k = (item: T) => item[key];
  } else {
    k = key;
  }
  let i = 0;
  for (const item of getD(arr)) {
    const key = k(item, i);
    this.$view.pushKey(key);
    body(item, i);
    this.$view.popKey(key);
    i++;
  }
  this.$view.popKey(ckey);
  return false;
};
contextFuncs.forRange = function (
  this: Context,
  ckey: string,
  times: D<number>,
  body: (index: number) => void,
) {
  this.$view.pushKey(ckey);
  times = getD(times);
  for (let i = 0; i < times; i++) {
    const key = i.toString();
    this.$view.pushKey(key);
    body(i);
    this.$view.popKey(key);
  }
  this.$view.popKey(ckey);
  return false;
};

export const byIndex = (_: any, index: number) => index.toString();
export const bySelf = (item: any) => `${item}`;
