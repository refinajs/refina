import { Plugin } from "../app";
import { _await } from "./await";
import { documentTitle } from "./documentTitle";
import { AsyncEmbed, Embed } from "./embed";
import { _for, forTimes } from "./loop";
import { portal } from "./portal";
import { provide } from "./provide";
import { now, setInterval } from "./timing";
import { useModel } from "./useModel";

const components = {
  asyncEmbed: AsyncEmbed,
  embed: Embed,
};

const contextFuncs = {
  await: _await,
  documentTitle,
  for: _for,
  forTimes,
  portal,
  provide,
  now,
  setInterval,
  useModel,
};

/**
 * The plugin that is always installed on the app.
 */
export const Prelude = {
  name: "prelude",
  components,
  contextFuncs,
  onError(error: unknown) {
    console.error(error);
  },
} satisfies Plugin;

declare module ".." {
  interface Plugins {
    prelude: typeof Prelude;
  }
}

export type { AsyncContentLoader } from "./embed";
export { byIndex, bySelf, type LoopKey } from "./loop";
