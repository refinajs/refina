import { Plugin } from "refina";
import { Router } from "./router";

const RouterPlugin = new Plugin("router", (app) => {
  app.router = new Router(app);
});
export default RouterPlugin;

declare module "refina" {
  interface App {
    router: Router;
  }
}
