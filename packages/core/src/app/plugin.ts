import {
  OutputComponentFactoryMap,
  StatusComponentFactory,
  StatusComponentFactoryMap,
  StatusComponentName,
  TriggerComponentFactoryMap,
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
   *
   * @param app The app to install the plugin on.
   * @param args Arguments to pass to the plugin.
   */
  install(app: App, ...args: Args) {
    this.app = app;

    // Call the onInstall hook.
    this.onInstall(app, ...args);

    // Merge the context functions in the plugin into the app.
    Object.assign(app.contextFuncs, this.contextFuncs);

    // Merge the component functions in the plugin into the app.
    for (const [name, factory] of Object.entries(this.outputComponents)) {
      app.contextFuncs[name] = createOutputComponentFunc(factory);
    }
    for (const [name, factory] of Object.entries(this.statusComponents)) {
      app.contextFuncs[name] = createStatusComponentFunc(
        factory as StatusComponentFactory<StatusComponentName>,
      );
    }
    for (const [name, factory] of Object.entries(this.triggerComponents)) {
      app.contextFuncs[name] = createTriggerComponentFunc(factory);
    }

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
   *
   * @param name The name of the context function.
   * @param func The context function, with the first argument being the Ckey and this type being the context.
   */
  registerFunc<N extends keyof ContextFuncs<any>>(
    name: N,
    func: ToRealContextFunc<N>,
  ) {
    // @ts-ignore
    this.contextFuncs[name] = func;
  }

  /**
   * The output component factory function map.
   */
  readonly outputComponents: Partial<OutputComponentFactoryMap> = {};

  /**
   * The status component factory function map.
   */
  readonly statusComponents: Partial<StatusComponentFactoryMap> = {};

  /**
   * The trigger component factory function map.
   */
  readonly triggerComponents: Partial<TriggerComponentFactoryMap> = {};
}
