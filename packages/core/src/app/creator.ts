import { Prelude } from "../constants";
import { App, AppView } from "./app";
import { Plugin } from "./plugin";

interface AppCreator {
  plugins: ((app: App) => void)[];
  use<Args extends any[]>(plugin: Plugin<Args>, ...args: Args): AppCreator;
  (view: AppView, rootElementId?: string): App;
}

function createAppCreator(): AppCreator {
  const creator: AppCreator = (
    view: AppView,
    rootElementId: string = "root",
  ) => {
    const app = new App(view, rootElementId);
    creator.plugins.forEach((plugin) => plugin(app));
    app.mount();
    return app;
  };
  creator.plugins = [(app) => Prelude.install(app)];
  creator.use = function <Args extends any[]>(
    plugin: Plugin<Args>,
    ...args: Args
  ) {
    const newCreator = createAppCreator();
    newCreator.plugins = [
      ...creator.plugins,
      (app) => plugin.install(app, ...args),
    ];
    return newCreator;
  };
  return creator;
}

export const app = createAppCreator();
