import { Prelude } from "../constants";
import { Context } from "../context";
import { D, getD } from "../data";

type KeyHelper<T> = {
  [K in keyof T]: T[K] extends string | number | bigint ? K : never;
}[keyof T];

export type KeyFunc<T> =
  | KeyHelper<T>
  | ((item: T, index: number) => D<string | number>);

function normalizeKey<T>(key: KeyFunc<T>) {
  return typeof key === "function" ? key : byProp(key);
}

Prelude.register("for", function <
  T,
>(this: Context, ckey: string, arr: D<Iterable<T>>, key: KeyFunc<T>, body: (item: T, index: number) => void) {
  this.$app.pushKey(ckey);
  const keyFunc = normalizeKey(key);
  let i = 0;
  for (const item of getD(arr)) {
    const key = keyFunc(item, i);
    this.$app.pushKey(key.toString());
    body(item, i);
    this.$app.popKey(key.toString());
    i++;
  }
  this.$app.popKey(ckey);
  return false;
});

Prelude.register(
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

declare module "../context" {
  interface CustomContext<C> {
    for: never extends C
      ? <T = unknown>(
          arr: D<Iterable<T>>,
          key: KeyFunc<T>,
          body: (item: T, index: number) => void,
        ) => void
      : never;
    forRange: never extends C
      ? (times: D<number>, body: (index: number) => void) => void
      : never;
  }
}

export const byIndex = (_: any, index: number) => index;
export const bySelf = (item: any) => `${item}`;
export const byProp =
  <T>(key: KeyHelper<T>) =>
  (obj: T) =>
    `${obj[key]}`;
