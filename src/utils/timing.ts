import { Context, contextFuncs } from "../context";

const registeredCallbacks = new Set<string>();

contextFuncs.now = function (this: Context, ckey: string, precisionMs = 1000) {
  if (this.$updating && !registeredCallbacks.has(ckey)) {
    registeredCallbacks.add(ckey);
    setTimeout(() => {
      registeredCallbacks.delete(ckey);
      this.$app.update();
    }, precisionMs);
  }
  return Date.now();
};

contextFuncs.setInterval = function (
  this: Context,
  ckey: string,
  callback: () => void,
  interval: number,
) {
  if (this.$updating && !registeredCallbacks.has(ckey)) {
    registeredCallbacks.add(ckey);
    setTimeout(() => {
      registeredCallbacks.delete(ckey);
      callback();
      this.$app.update();
    }, interval);
  }
};

declare module "../context" {
  interface CustomContext<C> {
    now(precisionMs?: number): number;
    setInterval: never extends C
      ? (callback: () => void, interval: number) => void
      : never;
  }
}
