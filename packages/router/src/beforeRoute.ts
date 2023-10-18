import RouterPlugin from "./plugin";
import { BeforeRouteContext, beforeRouteSymbol } from "./router";

RouterPlugin.register("beforeRoute", function (ckey: string) {
  if (this.$app.eventRecevier !== beforeRouteSymbol) return false;
  const pendingRoute = this.$app.eventData as BeforeRouteContext;
  if (pendingRoute) {
    Object.assign(this, pendingRoute);
    return true;
  }
  return false;
});

declare module "refina" {
  interface CustomContext<C> {
    beforeRoute: never extends C ? () => this is BeforeRouteContext : never;
  }
}
