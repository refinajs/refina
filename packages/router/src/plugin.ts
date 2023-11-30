import { Plugin } from "refina";
import { Router } from "./router";

const RouterPlugin = new Plugin("router", app => {
  const router = new Router(app);
  app.router = router;
  app.pushPermanentHook("afterMain", () => {
    router.updateCurrentPath();
  });
});
export default RouterPlugin;

declare module "refina" {
  interface App {
    router: Router;
  }
}
