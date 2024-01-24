import { $contextFunc, _ } from "../context";

export const now = $contextFunc(ckey =>
  /**
   * Get the current time in milliseconds.
   *
   * For every `precisionMs`, an `UPDATE` call will be scheduled to refresh the time.
   *
   * @param precisionMs The precision of the time in milliseconds.
   */
  (precisionMs = 1000): number => {
    const refTreeNode = _.$lowlevel.$$currentRefNode;
    if (_.$updateContext && !refTreeNode[ckey]) {
      refTreeNode[ckey] = true;
      setTimeout(() => {
        delete refTreeNode[ckey];
        _.$app.update();
      }, precisionMs);
    }
    return Date.now();
  },
);

export const setInterval = $contextFunc(ckey =>
  /**
   * Schedule a callback to be called every `interval` milliseconds.
   */
  (callback: () => void, interval: number): void => {
    const refTreeNode = _.$lowlevel.$$currentRefNode;
    if (_.$updateContext && !refTreeNode[ckey]) {
      refTreeNode[ckey] = true;
      setTimeout(() => {
        delete refTreeNode[ckey];
        callback();
        _.$app.update();
      }, interval);
    }
  },
);
