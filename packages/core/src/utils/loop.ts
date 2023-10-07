import { Context, addCustomContextFunc } from "../context";
import { D, getD } from "../data/index";

declare module "../context" {
  interface CustomContext<C> {
    for: never extends C
      ? <T = unknown>(
          arr: D<Iterable<T>>,
          key: keyof T | ((item: T, index: number) => D<string>),
          body: (item: T, index: number) => void,
        ) => void
      : never;
    forRange: never extends C
      ? (times: D<number>, body: (index: number) => void) => void
      : never;
  }
}
addCustomContextFunc("for", function <
  T,
>(this: Context, ckey: string, arr: D<Iterable<T>>, key: keyof T | ((item: T, index: number) => D<string>), body: (item: T, index: number) => void) {
  this.$app.pushKey(ckey);
  let k: any;
  if (typeof key === "string") {
    k = (item: T) => item[key];
  } else {
    k = key;
  }
  let i = 0;
  for (const item of getD(arr)) {
    const key = k(item, i);
    this.$app.pushKey(key);
    body(item, i);
    this.$app.popKey(key);
    i++;
  }
  this.$app.popKey(ckey);
  return false;
});

addCustomContextFunc(
  "forRange",
  function (ckey: string, times: D<number>, body: (index: number) => void) {
    this.$app.pushKey(ckey);
    times = getD(times);
    for (let i = 0; i < times; i++) {
      const key = i.toString();
      this.$app.pushKey(key);
      body(i);
      this.$app.popKey(key);
    }
    this.$app.popKey(ckey);
    return false;
  },
);

export const byIndex = (_: any, index: number) => index.toString();
export const bySelf = (item: any) => `${item}`;
export const byProp =
  <T>(
    key: {
      [K in keyof T]: T[K] extends string | number | bigint ? K : never;
    }[keyof T],
  ) =>
  (obj: T) =>
    `${obj[key]}`;
