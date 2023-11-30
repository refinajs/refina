import {
  ComponentConstructor,
  OutputComponent,
  OutputComponents,
  StatusComponent,
  StatusComponents,
  TriggerComponent,
  TriggerComponents,
  createOutputComponentFunc,
  createStatusComponentFunc,
  createTriggerComponentFunc,
} from "../component";
import type {
  ContextFuncs,
  RealContextFuncs,
  ToRealContextFunc,
} from "../context";
import type { App } from "./app";

export class Plugin<Args extends any[] = []> {
  /**
   * @param name The name of the plugin.
   * @param onInstall A hook that is called when the plugin is installed.
   */
  constructor(
    public name: string,
    public onInstall: (app: App, ...args: Args) => void = () => {},
  ) {}

  /**
   * The app that this plugin is installed on.
   */
  app: App;

  /**
   * Install the plugin on an app.
   * @param app The app to install the plugin on.
   * @param args Arguments to pass to the plugin.
   */
  install(app: App, ...args: Args) {
    this.app = app;

    // Call the onInstall hook.
    this.onInstall(app, ...args);

    // Merge the context functions in the plugin into the app.
    Object.assign(app.contextFuncs, this.contextFuncs);

    if (import.meta.env.DEV) {
      console.debug(`plugin ${this.name} installed.`);
    }
  }

  /**
   * All the **transformed** context functions that this plugin provides.
   */
  protected contextFuncs: Partial<RealContextFuncs> = {};

  /**
   * Register a **transformed** context function.
   * @param name The name of the context function.
   * @param func The context function, with the first argument being the Ikey and this type being the context.
   */
  registerFunc<N extends keyof ContextFuncs<any>>(
    name: N,
    func: ToRealContextFunc<N>,
  ) {
    // @ts-ignore
    this.contextFuncs[name] = func;
  }

  /**
   * Register an output component.
   * @param name The name of the component.
   * @returns A decorator that registers the component.
   */
  outputComponent<N extends keyof OutputComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<OutputComponent<any>>>(ctor: C) => {
      // @ts-ignore
      this.contextFuncs[name] = createOutputComponentFunc(ctor);
      return ctor;
    };
  }

  /**
   * Register a status component.
   * @param name The name of the component.
   * @returns A decorator that registers the component.
   */
  statusComponent<N extends keyof StatusComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<StatusComponent<any>>>(ctor: C) => {
      // @ts-ignore
      this.contextFuncs[name] = createStatusComponentFunc(ctor);
      return ctor;
    };
  }

  /**
   * Register a trigger component.
   * @param name The name of the component.
   * @returns A decorator that registers the component.
   */
  triggerComponent<N extends keyof TriggerComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<TriggerComponent<any, any>>>(
      ctor: C,
    ) => {
      // @ts-ignore
      this.contextFuncs[name] = createTriggerComponentFunc(ctor);
      return ctor;
    };
  }
}
