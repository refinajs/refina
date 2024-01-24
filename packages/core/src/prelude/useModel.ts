import { $contextFunc, _ } from "../context";
import { JustModel, model } from "../data";

export const useModel = $contextFunc(ckey =>
  /**
   * Create a model.
   *
   * @param init The initial value.
   */
  <T>(init: T): JustModel<T> => {
    const refTreeNode = _.$lowlevel.$$currentRefNode;
    if (!refTreeNode[ckey]) {
      refTreeNode[ckey] = model(init);
    }
    return refTreeNode[ckey] as JustModel<T>;
  },
);
