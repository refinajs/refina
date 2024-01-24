import { $contextFunc, _ } from "refina";
import { BeforeRouteContext, getIncomingRoute } from "./router";

export const beforeRoute = $contextFunc(
  () =>
    (): // @ts-expect-error
    this is BeforeRouteContext => {
      const incomingRoute = getIncomingRoute();
      if (incomingRoute) {
        // @ts-expect-error
        const pendingRoute = _.$ev as BeforeRouteContext;
        if (pendingRoute) {
          Object.assign(_, pendingRoute);
          return true;
        }
      }
      return false;
    },
);
