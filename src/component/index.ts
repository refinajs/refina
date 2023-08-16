import { CallbackComponentFuncs } from "./callback";
import { StatusComponentFuncs } from "./status";
import { TriggerComponentFuncs } from "./trigger";

export * from "./callback";
export * from "./component";
export * from "./status";
export * from "./trigger";

export type ComponentFuncs<C> = TriggerComponentFuncs<C> &
  StatusComponentFuncs<C> &
  CallbackComponentFuncs<C>;
