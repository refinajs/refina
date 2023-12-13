import { Prelude } from "../constants";

Prelude.registerFunc("now", function (ckey: string, precisionMs = 1000) {
  const refTreeNode = this.$intrinsic.$$currentRefTreeNode;
  if (this.$updateContext && !refTreeNode[ckey]) {
    refTreeNode[ckey] = true;
    setTimeout(() => {
      delete refTreeNode[ckey];
      this.$app.update();
    }, precisionMs);
  }
  return Date.now();
});

Prelude.registerFunc(
  "setInterval",
  function (ckey: string, callback: () => void, interval: number) {
    const refTreeNode = this.$intrinsic.$$currentRefTreeNode;
    if (this.$updateContext && !refTreeNode[ckey]) {
      refTreeNode[ckey] = true;
      setTimeout(() => {
        delete refTreeNode[ckey];
        callback();
        this.$app.update();
      }, interval);
    }
  },
);

declare module "../context/base" {
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
