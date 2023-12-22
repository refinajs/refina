import { Prelude } from "../constants";
import { LowlevelContext } from "../context";
import { PD, d } from "../data";

declare module "../context/base" {
  interface ContextFuncs<C extends ContextState> {
    /**
     * Create a `PD` object.
     *
     * @param init The initial value.
     */
    var<T>(init: T): PD<T>;
  }
}

Prelude.registerFunc("var", function <
  T,
>(this: LowlevelContext, ckey: string, init: T) {
  const refTreeNode = this.$$currentRefTreeNode;
  if (!refTreeNode[ckey]) {
    refTreeNode[ckey] = d(init);
  }
  return refTreeNode[ckey] as PD<T>;
});
