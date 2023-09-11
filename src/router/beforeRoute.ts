import { Context, contextFuncs } from "../context";
import { BeforeRouteContext } from "./router";

contextFuncs.beforeRoute = function (this: Context, ckey: string) {
  const pendingRoute = this.$router.pendingRoute;
  if (pendingRoute) {
    const beforeRouteContext = this as unknown as BeforeRouteContext;
    beforeRouteContext.$routeFrom = pendingRoute.$routeFrom;
    beforeRouteContext.$routeTo = pendingRoute.$routeTo;
    beforeRouteContext.$routeNext = pendingRoute.$routeNext;
    this.$router.pendingRoute = null;
    return true;
  }
  return false;
};

declare module "../context" {
  interface CustomContext<C> {
    beforeRoute(): this is BeforeRouteContext;
  }
}
