import RouterPlugin from "./plugin";
import { BeforeRouteContext, beforeRouteSymbol } from "./router";

RouterPlugin.registerFunc("beforeRoute", function (_ckey: string) {
  if (this.$app.isEventReceiver(beforeRouteSymbol)) {
    // @ts-ignore
    const pendingRoute = this.$ev as BeforeRouteContext;
    if (pendingRoute) {
      Object.assign(this, pendingRoute);
      return true;
    }
  }
  return false;
});

declare module "refina" {
  interface ContextFuncs<C> {
    beforeRoute: never extends C["enabled"]
      ? () => this is BeforeRouteContext
      : never;
  }
}
