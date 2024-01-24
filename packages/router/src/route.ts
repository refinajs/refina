import { $contextFunc, _ } from "refina";
import { matchPath } from "./utils";

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

export const route = $contextFunc(
  () =>
    <const S extends string>(
      path: S,
    ): // @ts-expect-error
    this is {
      $route: RouteParams<S>;
    } => {
      if (path[0] !== "/") {
        path = ("/" + path) as S;
      }

      if (
        Boolean(_.$runtimeData[routeMatchedSymbol]) &&
        _.$runtimeData[routeMatchedSymbol] !== path
      ) {
        // Make sure that the route is matched only once for one context.
        return false;
      }

      const currentPath = window.location.pathname;

      const matchResult = matchPath(path, currentPath);

      if (matchResult === false) return false;

      // @ts-expect-error
      _.$route = matchResult;

      // @ts-expect-error
      _.$route.$number = new Proxy(matchResult, {
        get: (target, key) => {
          // @ts-expect-error
          return +target[key];
        },
      });

      _.$runtimeData[routeMatchedSymbol] = true;
      return true;
    },
);

export const routeNotFound = $contextFunc(ckey => () => {
  return !_.$runtimeData[routeMatchedSymbol];
});
