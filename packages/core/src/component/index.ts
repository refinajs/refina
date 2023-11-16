import { ContextState } from "../context";
import { OutputComponentFuncs } from "./output";
import { StatusComponentFuncs } from "./status";
import { TriggerComponentFuncs } from "./trigger";

export * from "./component";
export * from "./output";
export * from "./status";
export * from "./trigger";

export type ComponentFuncs<C extends ContextState> = TriggerComponentFuncs<C> &
  StatusComponentFuncs<C> &
  OutputComponentFuncs<C>;

declare module "../context" {
  interface ContextFuncs<C> extends ComponentFuncs<C> {}
}
