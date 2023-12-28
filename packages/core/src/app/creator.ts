import { Prelude } from "../constants";
import { View } from "../view";
import { App } from "./app";
import { Plugin } from "./plugin";

/**
 * The app factory.
 */
interface AppFactory {
  /**
   * Used plugins to be installed on the app.
   */
  plugins: ((app: App) => void)[];

  /**
   * Use a plugin on the app.
   */
  use<Args extends any[]>(plugin: Plugin<Args>, ...args: Args): AppFactory;

  /**
   * Create an app.
   *
   * @returns The created app instance.
   */
  (main: View, rootElementId?: string): App;
}

function createAppFactory(): AppFactory {
  // The function that creates the app.
  const factory: AppFactory = (main: View, rootElementId: string = "root") => {
    const app = new App(main, rootElementId);
    factory.plugins.forEach(plugin => plugin(app));
    app.mount();
    return app;
  };

  // The plugins to be installed on the app.
  // Prelude is always installed as the first plugin.
  factory.plugins = [app => Prelude.install(app)];

  // Add the `use` method to the factory.
  factory.use = function <Args extends any[]>(
    plugin: Plugin<Args>,
    ...args: Args
  ) {
    const newFactory = createAppFactory();
    newFactory.plugins = [
      ...factory.plugins,
      // Bind arguments to the plugin's `install` method.
      app => plugin.install(app, ...args),
    ];
    return newFactory;
  };
  return factory;
}

// The initial app factory.
export const $app = createAppFactory();
