import { IntrinsicRecvContext, IntrinsicUpdateContext } from "../context";
import { App } from "./app";

/**
 * The map of app hooks.
 *
 * There are two types of hooks:
 * - **Onetime hooks**: removed after one call.
 * - **Permanent hooks**: not removed after calls.
 *
 * Add hook functions to the hook map by calling `app.pushOnetimeHook` or `app.pushPermanentHook`.
 */
export interface AppHookMap {
  /**
   * Initialize the context object.
   */
  initContext(
    this: App,
    context: IntrinsicRecvContext | IntrinsicUpdateContext,
  ): void;

  /**
   * Before the main function is executed, whether in `UPDATE` or `RECV` state.
   *
   * `app.runtimeData` is available in this hook.
   */
  beforeMain(this: App): void;

  /**
   * After the main function is executed, whether in `UPDATE` or `RECV` state.
   *
   * `app.runtimeData` is available in this hook.
   */
  afterMain(this: App): void;

  /**
   * Called after the main function is executed in `UPDATE` state,
   *  but before the DOM tree is modified and classes and styles are applied.
   *
   * `app.runtimeData` is available in this hook.
   */
  beforeModifyDOM(this: App): void;

  /**
   * Called after the main function is executed in `UPDATE` state,
   *  and the DOM tree is modified and classes and styles are applied.
   *
   * `app.runtimeData` is available in this hook.
   */
  afterModifyDOM(this: App): void;

  /**
   * Called when an error is thrown in the main function.
   */
  onError(this: App, error: unknown): void;
}

export const appHookNames: (keyof AppHookMap)[] = [
  "initContext",
  "beforeMain",
  "afterMain",
  "beforeModifyDOM",
  "afterModifyDOM",
  "onError",
];
