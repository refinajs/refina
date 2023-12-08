import { Component } from "../component";
import { AppStateType } from "../constants";
import { Context, IntrinsicContext, RealContextFuncs } from "../context";
import { D, dangerously_setD } from "../data";
import {
  DOMBodyComponent,
  DOMElementComponent,
  DOMNodeComponent,
  DOMRootComponent,
} from "../dom";
import { DOMWindowComponent } from "../dom/window";
import type { View } from "../view";

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
   * Before the main function is executed, whether in `UPDATE` or `RECV` state.
   *
   * `app.runtimeData` is available in this hook.
   */
  beforeMain: () => void;

  /**
   * After the main function is executed, whether in `UPDATE` or `RECV` state.
   *
   * `app.runtimeData` is available in this hook.
   */
  afterMain: () => void;

  /**
   * Called after the main function is executed in `UPDATE` state,
   *  but before the DOM tree is modified and classes and styles are applied.
   *
   * `app.runtimeData` is available in this hook.
   */
  beforeModifyDOM: () => void;

  /**
   * Called after the main function is executed in `UPDATE` state,
   *  and the DOM tree is modified and classes and styles are applied.
   *
   * `app.runtimeData` is available in this hook.
   */
  afterModifyDOM: () => void;

  /**
   * Called when an error is thrown in the main function.
   */
  onError: (error: unknown) => void;
}

export interface AppIdleState {
  type: AppStateType.IDLE;
}

export interface AppRunningState {
  type: AppStateType.UPDATE | AppStateType.RECV;

  /**
   * The stack of Ikeys.
   *
   * For better performance, the stack stores the full Ikey of each component instead of the relative Ikey.
   *
   * @example ["0-0", "0-0.1-0", "0-0.1-0.1-1"]
   */
  ikeyStack: string[];

  /**
   * Lifetime: one `UPDATE` or `RECV` call.
   *
   * Can be accessed in hooks like `beforeMain` and `afterModifyDOM`.
   */
  runtimeData: Record<symbol, any>;

  /**
   * Usage:
   * 1. To check if a component is processed for multiple times;
   * 2. To decide whether to dispose a component.
   */
  processedComponents: Set<string>;
}

export interface AppUpdateState extends AppRunningState {
  type: AppStateType.UPDATE;

  /**
   * The current parent DOM element.
   */
  currentDOMParent: DOMElementComponent;

  /**
   * Components waiting for a `$mainEl`.
   *
   * If the value is `true`, the component is waiting for the first DOM element to be its default `$mainEl`.
   */
  pendingMainElOwner: (DOMElementComponent | Component)[];
}

export interface AppRecvState extends AppRunningState {
  type: AppStateType.RECV;

  /**
   * The receiver of the event.
   *
   * - If it is of type `string`, it is the Ikey of the receiver.
   *
   * - If it is of type `symbol`, it is a user-defined event receiver.
   */
  receiver: string | symbol;

  /**
   * The event data.
   */
  event: any;
}

/**
 * The state of the app.
 */
export type AppState = AppIdleState | AppUpdateState | AppRecvState;

/**
 * `App` in `UPDATE` or `RECV` state.
 */
export type RunningApp = App & { state: AppRunningState };

const idleState = { type: AppStateType.IDLE } satisfies AppIdleState;

export class App {
  /**
   * @param main The main function of the app
   * @param rootElementId The id of the root element to mount the app. Usually it is `"root"`.
   */
  constructor(
    public main: View,
    public rootElementId: string,
  ) {
    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      throw new Error(`Root element ${rootElementId} not found.`);
    }
    this.root = new DOMRootComponent("~", rootElement);
  }

  /**
   * The map of context functions that are transformed, excluding HTML/SVG/Text element funcs.
   *
   * Context functions provided by plugins should be merged into this object.
   */
  contextFuncs = {} as RealContextFuncs;

  /**
   * The map of HTML element aliases.
   *
   * Most frequently used to process Web Components with slashes in their names.
   *
   * Plugins can add aliases to this map.
   */
  htmlElementAlias: Record<string, string> = {};

  /**
   * The root element component of the app.
   *
   * Initialized in the constructor depending on `rootElementId`.
   *
   * Call `app.root.addCls` or `app.root.addCss` to add classes or styles to the root element.
   */
  root: DOMRootComponent;

  /**
   * The DOM element component of the document body.
   *
   * Call `app.body.addCls` or `app.body.addCss` to add classes or styles to the document body.
   */
  body = new DOMBodyComponent("body", document.body);

  /**
   * The DOM element component of the window.
   *
   * Call `app.window.addEventListener` to add event listeners to window.
   */
  window = new DOMWindowComponent("window", window);

  /**
   * The map from Ikey to component instance.
   *
   * **Warning**: By default, component instances not currently rendered won't be removed from this map.
   */
  refMap: Map<string | symbol, any> = new Map();

  /**
   * The map from DOM node to DOM component instance.
   *
   * **Warning**: By default, DOM component instances not currently rendered won't be removed from this map.
   */
  nodeMap: Map<Node, DOMNodeComponent> = new Map();

  /**
   * Lifetime: from the construction of the app to the window is closed.
   */
  permanentData: Record<symbol, any> = {};

  /**
   * The current state of the app.
   */
  state: AppState = idleState;

  /**
   * Each event in this queue requires a later `RECV` call.
   *
   * Can be pushed during `RECV` calls, which means a new event can be triggered by another event.
   */
  eventQueue: { receiver: string | symbol; data: any }[] = [];

  /**
   * Whether an `UPDATE` call is required after the recv queue becomes empty.
   */
  requireUpdate = false;

  /**
   * Mount the app to the root element.
   */
  mount() {
    // Wait until all components registered.
    // Because the execution order of top-level code in different modules is not guaranteed,
    setTimeout(() => {
      this.execUpdate();
    });
  }

  /**
   * Trigger an `UPDATE` call.
   */
  update = () => {
    if (import.meta.env.DEV)
      console.debug(`[*] update triggered${new Error().stack?.slice(5)}`);
    this.requireUpdate = true;

    // If the app is not running, start it in the next tick.
    if (this.state.type === AppStateType.IDLE) this.nextTick();
  };

  /**
   * Trigger a `RECV` call.
   *
   * @param receiver The receiver of the event.
   * @param data The event data.
   */
  recv = (receiver: string | symbol, data: any) => {
    if (import.meta.env.DEV)
      console.debug(
        `[*] recv triggered with receiver ${String(
          receiver,
        )}${new Error().stack?.slice(5)}`,
      );
    this.eventQueue.push({ receiver, data });

    // An `UPDATE` call is always required after a `RECV` call.
    this.requireUpdate = true;

    // If the app is not running, start it in the next tick.
    if (this.state.type === AppStateType.IDLE) this.nextTick();
  };

  /**
   * In the next tick, if the event queue non-empty, make a `RECV` call for the first event in the queue.
   * Otherwise, if the app needs to update, make an `UPDATE` call.
   */
  nextTick() {
    setTimeout(
      import.meta.env.DEV
        ? () => {
            // In development mode, print the debug information.

            console.debug(`[!] next tick`);
            if (this.eventQueue.length > 0) {
              // Dequeue the first event and execute it.
              const { receiver, data } = this.eventQueue.shift()!;

              console.debug(
                `[+] recv executing start with id ${String(
                  receiver,
                )}, remaining ${this.eventQueue.length}`,
              );

              const startTime = window.performance.now();

              this.execRecv(receiver, data);

              console.debug(
                `[-] recv executed with id ${String(receiver)} in ${
                  window.performance.now() - startTime
                }ms`,
              );

              // There must be at least one `UPDATE` call.
              this.nextTick();
            } else if (this.requireUpdate) {
              // Clear the flag.
              this.requireUpdate = false;

              console.debug(`[+] update executing start`);

              const startTime = window.performance.now();

              this.execUpdate();

              console.debug(
                `[-] update executed in ${
                  window.performance.now() - startTime
                }ms`,
              );
            }
          }
        : () => {
            if (this.eventQueue.length > 0) {
              // Dequeue the first event and execute it.
              const { receiver, data } = this.eventQueue.shift()!;

              this.execRecv(receiver, data);

              // There must be at least one `UPDATE` call.
              this.nextTick();
            } else if (this.requireUpdate) {
              // Clear the flag.
              this.requireUpdate = false;

              this.execUpdate();
            }
          },
    );
  }

  /**
   * Execute the main function of the app in current state.
   */
  protected execMain() {
    try {
      const initialKey = this.currentIkey;

      const context = new IntrinsicContext(
        this as RunningApp,
      ) as unknown as Context;

      this.callHook("beforeMain");
      this.main(context);
      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }
      this.callHook("afterMain");

      // Assert that the Ikey stack is balanced.
      if (import.meta.env.DEV) {
        if (initialKey !== this.currentIkey) {
          throw new Error(
            `Key mismatch: ${initialKey} !== ${this.currentIkey}. You may have forgotten to call app.popKey().`,
          );
        }
      }
    } catch (e) {
      // Report the error to the console instead of throwing it to make sure the cleanup code is executed.
      console.error("Error when executing main:", e, "\nstate:", this.state);
    }
  }

  protected execUpdate() {
    // Set the `UPDATE` state.
    this.state = {
      type: AppStateType.UPDATE,
      ikeyStack: ["~"],
      runtimeData: {},
      processedComponents: new Set(),
      currentDOMParent: this.root,
      pendingMainElOwner: [],
    } satisfies AppUpdateState;

    // Execute the main function to update components.
    this.execMain();

    // Apply changes to DOM.
    this.callHook("beforeModifyDOM");
    this.window.updateDOM();
    this.body.updateDOM();
    this.root.updateDOM();
    this.callHook("afterModifyDOM");

    // Clear the `UPDATE` state.
    this.state = idleState;
  }

  protected execRecv(receiver: string | symbol, event: any = null) {
    // Set the `RECV` state.
    this.state = {
      type: AppStateType.RECV,
      ikeyStack: ["~"],
      runtimeData: {},
      processedComponents: new Set(),
      receiver,
      event,
    } satisfies AppRecvState;

    // Execute the main function to receive the event.
    this.execMain();

    // Clear the `RECV` state.
    this.state = idleState;
  }

  /**
   * Lifecycle: removed after one call.
   */
  onetimeHooks: { [K in keyof AppHookMap]?: AppHookMap[K][] } = {};

  /**
   * Lifecycle: not removed after calls.
   */
  permanentHooks: {
    [K in keyof AppHookMap]?: AppHookMap[K][];
  } = {};

  /**
   * Promises that resolve after the corresponding hooks are called.
   */
  readonly promises = {
    /**
     * Store the app instance, because `this` is lost in the getters.
     */
    app: this,

    /**
     * This promise resolves after the `beforeMain` hook is called.
     */
    get mainExecuted(): Promise<void> {
      return new Promise(resolve => {
        this.app.pushOnetimeHook("afterMain", resolve);
      });
    },

    /**
     * This promise resolves after the `beforeModifyDOM` hook is called.
     */
    get DOMUpdated(): Promise<void> {
      return new Promise(resolve => {
        this.app.pushOnetimeHook("afterModifyDOM", resolve);
      });
    },
  };

  /**
   * Call onetime hooks and reset them, then call permanent hooks.
   *
   * @param hookName the name of the hooks to call
   * @param args the arguments to pass to each hook
   */
  callHook<K extends keyof AppHookMap>(
    hookName: K,
    ...args: Parameters<AppHookMap[K]>
  ): void {
    const onetimeHooks = this.onetimeHooks[hookName];
    if (onetimeHooks) {
      // Reset the runtime hooks.
      this.onetimeHooks[hookName] = undefined;
      // @ts-ignore
      onetimeHooks.forEach(hook => hook(...args));
    }

    const permanentHooks = this.permanentHooks[hookName];
    if (permanentHooks) {
      // @ts-ignore
      permanentHooks.forEach(hook => hook(...args));
    }
  }

  /**
   * Add a onetime hook to the end of the hook queue.
   *
   * @param hookName The name of the hook to push
   * @param hooks The hook to push
   */
  pushOnetimeHook<K extends keyof AppHookMap>(
    hookName: K,
    hook: AppHookMap[K],
  ): void {
    this.onetimeHooks[hookName] ??= [];
    this.onetimeHooks[hookName]!.push(hook);
  }

  /**
   * Add a permanent hook to the end of the hook queue.
   *
   * @param hookName
   * @param hooks
   */
  pushPermanentHook<K extends keyof AppHookMap>(
    hookName: K,
    ...hooks: AppHookMap[K][]
  ): void {
    this.permanentHooks[hookName] ??= [];
    this.permanentHooks[hookName]!.push(...hooks);
  }

  /**
   * Set the value of a `D` and trigger an `UPDATE` call if the value is changed.
   *
   * @param d The `D` to set
   * @param v The value to set
   * @returns Whether the value is changed, i.e. whether an `UPDATE` call is triggered or whether `d` is a `PD`.
   */
  setD = <T>(d: D<T>, v: T): boolean => {
    if (dangerously_setD(d, v)) {
      this.update();
      return true;
    }
    return false;
  };

  /**
   * Push a Ckey to the Ikey stack.
   *
   * @param ckey The Ckey to push to the Ikey stack.
   * @returns The current Ikey.
   */
  pushKey(ckey: string) {
    const currentIkey = this.currentIkey + "." + ckey;
    (this.state as AppRunningState).ikeyStack.push(currentIkey);
    return currentIkey;
  }

  /**
   * Pop a Ikey from the Ikey stack.
   *
   * @param ikey The Ikey to pop from the Ikey stack. Used to check if the stack is balanced in development mode.
   */
  popKey(ikey: string) {
    const last = (this.state as AppRunningState).ikeyStack.pop();
    if (import.meta.env.DEV) {
      if (ikey !== last) {
        throw new Error(
          `Ikey stack is unbalanced: want to pop "${ikey}", but the last Ikey is "${last}".`,
        );
      }
    }
  }

  /**
   * The current Ikey.
   */
  get currentIkey() {
    return (this.state as AppRunningState).ikeyStack.at(-1)!;
  }

  /**
   * `true` if the app is under `RECV` state and the receiver is `key`.
   *
   * @param key The key to test.
   * @returns `true` if the app is under `RECV` state and the receiver is `key`.
   */
  isEventReceiver(key: string | symbol): this is { state: AppRecvState } {
    return this.state.type === AppStateType.RECV && this.state.receiver === key;
  }
}
