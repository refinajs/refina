import { App } from "../app";

export interface BeforeRouteContext {
  $routeFrom: string | null;
  $routeTo: string;
  $routeNext(path?: string): void;
}

export class Router {
  pendingRoute: null | BeforeRouteContext;
  constructor(public app: App) {
    this.setPendingRoute(
      (path) => {
        history.replaceState({}, "", path);
      },
      window.location.href,
      null,
    );
  }
  // base: "/",
  toAbsolute(path: string) {
    // if (path[0] === "/" && this.base.at(-1) === "/") {
    //   return this.base.slice(0, -1) + path;
    // }
    // return this.base + path;
    return path;
  }
  setPendingRoute(
    next: (path: string) => void,
    to: string,
    from: string | null = window.location.pathname,
  ) {
    this.pendingRoute = {
      $routeFrom: from,
      $routeTo: to,
      $routeNext: (path: string = to) => {
        next(this.toAbsolute(path));
      },
    };
    this.app.update();
  }
  push(path: string) {
    this.setPendingRoute((path) => {
      history.pushState({}, "", path);
    }, path);
  }
  get goto() {
    return this.push;
  }
  replace(path: string) {
    this.setPendingRoute((path) => {
      history.replaceState({}, "", path);
    }, path);
  }
}
