import { Prelude } from "../constants";
import type { IntrinsicBaseContext } from "../context";
import { JustModel, model } from "../data";

declare module "../context/base" {
  interface ContextFuncs<C extends ContextState> {
    /**
     * Create a model.
     *
     * @param init The initial value.
     */
    useModel<T>(init: T): JustModel<T>;
  }
}

Prelude.registerFunc("useModel", function <
  T,
>(this: IntrinsicBaseContext, ckey: string, init: T) {
  const refTreeNode = this.$$currentRefTreeNode;
  if (!refTreeNode[ckey]) {
    refTreeNode[ckey] = model(init);
  }
  return refTreeNode[ckey] as JustModel<T>;
});
