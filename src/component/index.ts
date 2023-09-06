import { CallbackComponentFuncs } from "./callback";
import { OutputComponentFuncs } from "./output";
import { StatusComponentFuncs } from "./status";
import { TriggerComponentFuncs } from "./trigger";

export * from "./callback";
export * from "./component";
export * from "./embed.r";
export * from "./output";
export * from "./status";
export * from "./trigger";

export interface CustomComponentFuncs<C> {}

export type ComponentFuncs<C> = CustomComponentFuncs<C> &
  TriggerComponentFuncs<C> &
  StatusComponentFuncs<C> &
  CallbackComponentFuncs<C> &
  OutputComponentFuncs<C>;
