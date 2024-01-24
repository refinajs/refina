import { Plugin } from "refina";
import { beforeRoute } from "./beforeRoute";
import { route, routeNotFound } from "./route";
import { Router } from "./router";

export default {
  name: "router",
  contextFuncs: {
    beforeRoute,
    route,
    routeNotFound,
  },
  onInstall(app) {
    app.router = new Router(app);
  },
  initContext(context) {
    context.$router = this.router;
  },
  afterMain() {
    this.router.updateCurrentPath();
  },
} satisfies Plugin;

declare module "refina" {
  interface App {
    router: Router;
  }
  interface IntrinsicBaseContext {
    $router: Router;
  }
}
