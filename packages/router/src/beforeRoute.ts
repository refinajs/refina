import RouterPlugin from "./plugin";
import { BeforeRouteContext } from "./router";

RouterPlugin.register("beforeRoute", function (ckey: string) {
  const pendingRoute = this.$app.router.pendingRoute;
  if (pendingRoute) {
    const beforeRouteContext = this as unknown as BeforeRouteContext;
    beforeRouteContext.$routeFrom = pendingRoute.$routeFrom;
    beforeRouteContext.$routeTo = pendingRoute.$routeTo;
    beforeRouteContext.$routeNext = pendingRoute.$routeNext;
    this.$app.router.pendingRoute = null;
    return true;
  }
  return false;
});

declare module "refina" {
  interface CustomContext<C> {
    beforeRoute: never extends C ? () => this is BeforeRouteContext : never;
  }
}
