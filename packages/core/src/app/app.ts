import { AppState } from "../constants";
import {
  RealContextFuncs,
  _,
  initializeRecvContext,
  initializeUpdateContext,
  invalidateContext,
} from "../context";
import { Model, dangerously_updateModel } from "../data";
import {
  DOMBodyComponent,
  DOMRootComponent,
  DOMWindowComponent,
  View,
} from "../dom";
import { AppHookMap } from "./hooks";
import { PluginOption, installPlugins } from "./plugin";

export type RefTreeNode = Record<string, unknown>;

export type AppOptions =
  | {
      name?: string;
      plugins?: PluginOption;
      root?: string | HTMLElement;
    }
  | PluginOption;

export class App {
  constructor(
    options: AppOptions,
    public main: View,
  ) {
    if (import.meta.env.DEV) console.debug(`[*] create app`);

    if (Array.isArray(options)) {
      options = { plugins: options };
    }

    this.name = options.name;

    installPlugins(this, options.plugins ?? []);

    const elementOrSelector = options.root ?? "#app";
    if (typeof elementOrSelector === "string") {
      const element = document.querySelector(elementOrSelector);
      if (!element) {
        throw new Error(`Root element ${elementOrSelector} not found.`);
      }
      this.root = new DOMRootComponent(element as HTMLElement);
    } else {
      this.root = new DOMRootComponent(elementOrSelector);
    }
  }

  readonly name: string | undefined;

  readonly plugins: PluginOption;

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

  requireRecv: boolean;

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
   */
  readonly recv = () => {
    if (import.meta.env.DEV) {
      const stack = new Error().stack?.replace(/.*\n.*/, "");
      console.debug(`[*] recv triggered${stack}`);
    }

    this.requireRecv = true;
    this.requireUpdate = true;

    if (this.state === AppState.IDLE) {
      this.state = AppState.RECV;

      while (this.requireRecv) {
        if (import.meta.env.DEV) console.debug(`[+] recv start`);

        this.requireRecv = false;

        initializeRecvContext(this);
        this.execMain();
        if (import.meta.env.DEV) {
          invalidateContext();
          console.debug(`[-] recv end`);
        }
      }

      this.state = AppState.IDLE;
      this.execUpdate();
    } else if (this.state === AppState.RECV) {
      this.requireRecv = true;
    } else if (this.state === AppState.UPDATE) {
      throw new Error("Cannot call trigger recv in `UPDATE` state.");
    }
  };

  protected execUpdate() {
    setTimeout(() => {
      if (!this.requireUpdate) return;

      if (import.meta.env.DEV) console.debug(`[+] update start`);

      this.state = AppState.UPDATE;

      initializeUpdateContext(this);
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

      if (import.meta.env.DEV) {
        invalidateContext();
        console.debug(`[-] update end`);
      }
    });
  }

  /**
   * Execute the main function of the app in current state.
   */
  protected execMain() {
    try {
      this.callHook("beforeMain");
      this.main(_);
      if (import.meta.env.DEV) {
        _.$lowlevel.$$assertEmpty();
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
      // @ts-expect-error
      onetimeHooks.forEach(hook => hook.apply(this, args));
    }

    const permanentHooks = this.permanentHooks[hookName];
    if (permanentHooks) {
      // @ts-expect-error
      permanentHooks.forEach(hook => hook.apply(this, args));
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
   * Set the value of a model and trigger an `UPDATE` call if the value is changed.
   *
   * @param model The model.
   * @param v The new value.
   * @returns Whether the value is changed.
   */
  updateModel = <T>(model: Model<T>, v: T): boolean => {
    if (dangerously_updateModel(model, v)) {
      this.update();
      return true;
    }
    return false;
  };
}

export function $app(options: AppOptions, main: View): App {
  const app = new App(options, main);
  app.mount();
  return app;
}
