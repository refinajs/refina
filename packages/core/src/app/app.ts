import { AppState } from "../constants";
import {
  IntrinsicRecvContext,
  IntrinsicUpdateContext,
  LowlevelContext,
  RealContextFuncs,
  initializeRecvContext,
  initializeUpdateContext,
} from "../context";
import { D, dangerously_setD } from "../data";
import { DOMBodyComponent, DOMRootComponent } from "../dom";
import { DOMWindowComponent } from "../dom/window";
import type { View } from "../view";

export type RefTreeNode = Record<string, unknown>;

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
  initContext: (context: IntrinsicRecvContext | IntrinsicUpdateContext) => void;

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
    this.root = new DOMRootComponent(rootElement);
  }

  /**
   * The map of context functions that are transformed, excluding HTML/SVG/Text element funcs.
   *
   * Context functions provided by plugins should be merged into this object.
   */
  readonly contextFuncs = {} as RealContextFuncs;

  /**
   * The map of HTML element aliases.
   *
   * Most frequently used to process Web Components with slashes in their names.
   *
   * Plugins can add aliases to this map.
   */
  readonly htmlElementAlias: Record<string, string> = {};

  /**
   * The root element component of the app.
   *
   * Initialized in the constructor depending on `rootElementId`.
   *
   * Call `app.root.addCls` or `app.root.addCss` to add classes or styles to the root element.
   */
  readonly root: DOMRootComponent;

  /**
   * The DOM element component of the document body.
   *
   * Call `app.body.addCls` or `app.body.addCss` to add classes or styles to the document body.
   */
  readonly body = new DOMBodyComponent(document.body);

  /**
   * The DOM element component of the window.
   *
   * Call `app.window.addEventListener` to add event listeners to window.
   */
  readonly window = new DOMWindowComponent(window);

  /**
   * Lifetime: from the construction of the app to the window is closed.
   */
  readonly permanentData: Record<symbol, unknown> = {};

  /**
   * The state of the app.
   */
  state: AppState = AppState.IDLE;

  /**
   * The context of the app.
   */
  readonly context = {} as unknown as LowlevelContext;

  /**
   * Each event in this queue requires a later `RECV` call.
   *
   * Can be pushed during `RECV` calls, which means a new event can be triggered by another event.
   */
  eventQueue: [receiver: unknown, data: unknown][] = [];

  /**
   * Whether an `UPDATE` call is required after the recv queue becomes empty.
   */
  requireUpdate: boolean;

  /**
   * Mount the app to the root element.
   */
  mount() {
    if (import.meta.env.DEV) console.debug(`[*] mount app`);

    // `setTimeout` in `this.execUpdate` to wait until all components registered.
    // Because the execution order of top-level code in different modules is not guaranteed.
    this.requireUpdate = true;
    this.execUpdate();
  }

  /**
   * Trigger an `UPDATE` call.
   */
  readonly update = () => {
    if (import.meta.env.DEV) {
      const stack = new Error().stack?.replace(/.*\n.*/, "");
      console.debug(`[*] update triggered${stack}`);
    }

    this.requireUpdate = true;

    if (this.state === AppState.IDLE) {
      this.execUpdate();
    }
  };

  /**
   * Trigger a `RECV` call.
   *
   * @param receiver The receiver of the event.
   * @param data The event data.
   */
  readonly recv = (receiver: unknown, data: unknown) => {
    if (import.meta.env.DEV) {
      const stack = new Error().stack?.replace(/.*\n.*/, "");
      console.debug(`[*] recv triggered (receiver: ${receiver})${stack}`);
    }

    if (this.state === AppState.IDLE) {
      this.state = AppState.RECV;
      this.eventQueue = [[receiver, data]];
      this.requireUpdate = true;

      while (this.eventQueue.length > 0) {
        const [receiver, data] = this.eventQueue.shift()!;

        if (import.meta.env.DEV)
          console.debug(`[+] recv start (receiver: ${receiver}`);

        initializeRecvContext(
          this.context as unknown as IntrinsicRecvContext,
          this,
          receiver,
          data,
        );
        this.execMain();

        if (import.meta.env.DEV)
          console.debug(`[-] recv end (receiver: ${receiver}`);
      }

      this.state = AppState.IDLE;
      this.execUpdate();
    } else if (this.state === AppState.RECV) {
      this.eventQueue.push([receiver, data]);
    } else if (this.state === AppState.UPDATE) {
      throw new Error("Cannot call trigger recv in `UPDATE` state.");
    }
  };

  protected execUpdate() {
    setTimeout(() => {
      if (!this.requireUpdate) return;

      if (import.meta.env.DEV) console.debug(`[+] update start`);

      this.state = AppState.UPDATE;

      initializeUpdateContext(
        this.context as unknown as IntrinsicUpdateContext,
        this,
      );
      this.execMain();

      // Apply changes to DOM.
      this.callHook("beforeModifyDOM");
      this.window.updateDOM();
      this.body.updateDOM();
      this.root.updateDOM();
      this.callHook("afterModifyDOM");

      // Clear the `UPDATE` state.
      this.state = AppState.IDLE;
      this.requireUpdate = false;

      if (import.meta.env.DEV) console.debug(`[-] update end`);
    });
  }

  /**
   * Execute the main function of the app in current state.
   */
  protected execMain() {
    try {
      this.callHook("beforeMain");
      this.main(this.context);
      if (import.meta.env.DEV) {
        this.context.$$assertEmpty();
        if (window.__REFINA_HMR__) {
          window.__REFINA_HMR__.removedCkeys = [];
        }
      }
      this.callHook("afterMain");
    } catch (e) {
      // Do not throw the error to make sure the cleanup code is executed.
      this.callHook("onError", e);
    }
  }

  /**
   * Lifecycle: removed after one call.
   */
  onetimeHooks: { [K in keyof AppHookMap]?: AppHookMap[K][] } = {};

  /**
   * Lifecycle: not removed after calls.
   */
  readonly permanentHooks: {
    [K in keyof AppHookMap]?: AppHookMap[K][];
  } = {};

  /**
   * Promises that resolve after the corresponding hooks are called.
   */
  readonly promises = {
    /**
     * Store the app instance, because `this` is lost in the getters.
     */
    app: this as App,

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
   * `true` if the app is under `RECV` state and the receiver is `key`.
   *
   * @param receiver The receiver to test.
   * @returns `true` if the app is under `RECV` state and the receiver is `key`.
   */
  isEventReceiver(receiver: unknown): boolean {
    if (
      this.context.$recvContext &&
      this.context.$recvContext.$receiver === receiver
    ) {
      return true;
    } else {
      return false;
    }
  }
}
