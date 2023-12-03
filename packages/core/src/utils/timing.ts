import { Prelude } from "../constants";

const registeredCallbacks = new Set<string>();

Prelude.registerFunc("now", function (ckey: string, precisionMs = 1000) {
  const ikey = this.$app.pushKey(ckey);

  if (this.$updateState && !registeredCallbacks.has(ikey)) {
    registeredCallbacks.add(ikey);
    setTimeout(() => {
      registeredCallbacks.delete(ikey);
      this.$app.update();
    }, precisionMs);
  }

  this.$app.popKey(ikey);
  return Date.now();
});

Prelude.registerFunc(
  "setInterval",
  function (ckey: string, callback: () => void, interval: number) {
    const ikey = this.$app.pushKey(ckey);

    if (this.$updateState && !registeredCallbacks.has(ikey)) {
      registeredCallbacks.add(ikey);
      setTimeout(() => {
        registeredCallbacks.delete(ikey);
        callback();
        this.$app.update();
      }, interval);
    }

    this.$app.popKey(ikey);
  },
);

declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Get the current time in milliseconds.
     *
     * For every `precisionMs`, an `UPDATE` call will be scheduled to refresh the time.
     *
     * @param precisionMs The precision of the time in milliseconds.
     */
    now: never extends C["enabled"] ? (precisionMs?: number) => number : never;

    /**
     * Schedule a callback to be called every `interval` milliseconds.
     */
    setInterval: never extends C["enabled"]
      ? (callback: () => void, interval: number) => void
      : never;
  }
}
