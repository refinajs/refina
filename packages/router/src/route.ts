import { matchPath } from "./utils";
import RouterPlugin from "./plugin";

type RouteParamsImpl<
  O extends 0 | 1,
  K extends string,
  S extends string,
> = S extends `:${infer Rest}`
  ? RouteParamsImpl<1, "", Rest>
  : S extends `/${infer Rest}`
  ? (O extends 1 ? K : never) | RouteParamsImpl<0, "", Rest>
  : S extends `${infer L0}${infer Ls}`
  ? RouteParamsImpl<O, `${K}${L0}`, Ls>
  : S extends ""
  ? O extends 1
    ? K
    : never
  : never;

type RouteParams<S extends string> = {
  [K in RouteParamsImpl<0, "", S>]: string;
} & {
  $number: {
    [K in RouteParamsImpl<0, "", S>]: number;
  };
};

const routeMatchedSymbol = Symbol("routeMatched");

RouterPlugin.register("route", function (ckey: string, path: string) {
  if (path[0] !== "/") {
    path = "/" + path;
  }

  if (
    Boolean(this.$customData[routeMatchedSymbol]) &&
    this.$customData[routeMatchedSymbol] !== path
  ) {
    // Make sure that the route is matched only once for one context.
    return false;
  }

  const currentPath = window.location.pathname;

  const matchResult = matchPath(path, currentPath);

  if (matchResult === false) return false;

  //@ts-ignore
  this.$route = matchResult;

  //@ts-ignore
  this.$route.$number = new Proxy(matchResult, {
    get: (target, key) => {
      //@ts-ignore
      return +target[key];
    },
  });

  this.$customData[routeMatchedSymbol] = true;
  return true;
});

RouterPlugin.register("routeNotFound", function (ckey: string) {
  return !this.$customData[routeMatchedSymbol];
});

declare module "refina" {
  interface CustomContext<C> {
    route: never extends C
      ? <const S extends string>(
          path: S,
        ) => this is {
          $route: RouteParams<S>;
        }
      : never;
    routeNotFound: never extends C ? () => boolean : never;
  }
}
