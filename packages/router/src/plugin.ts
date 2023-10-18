import { Plugin } from "refina";
import { Router } from "./router";

const RouterPlugin = new Plugin("router", (app) => {
  const router = new Router(app);
  app.router = router;
  app.addPermanentHook("initializeContext", (context) => {
    context.$router = router;
  });
  app.addPermanentHook("afterMain", () => {
    router.updateCurrentPath();
  });
});
export default RouterPlugin;

declare module "refina" {
  interface App {
    router: Router;
  }
  interface IntrinsicContext<C> {
    $router: Router;
  }
}
