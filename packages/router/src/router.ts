import { App } from "refina";

export const beforeRouteSymbol = Symbol("before route");

export interface BeforeRouteContext {
  $routeFrom: string | null;
  $routeTo: string;
  $routeNext(path?: string): void;
}

export class Router {
  constructor(public app: App) {
    this.updateCurrentPath();

    this.setPendingRoute(
      (path) => {
        history.replaceState({}, "", path);
      },
      this.currentPath,
      null,
    );

    window.addEventListener("popstate", (ev) => {
      this.setPendingRoute((path) => {
        history.replaceState({}, "", path);
      }, window.location.pathname);
    });
  }
  currentPath: string;
  updateCurrentPath() {
    this.currentPath = window.location.pathname;
  }
  setPendingRoute(
    next: (path: string) => void,
    to: string,
    from: string | null = window.location.pathname,
  ) {
    this.app.recv(beforeRouteSymbol, {
      $routeFrom: from,
      $routeTo: to,
      $routeNext: (path: string = to) => {
        next(path);
      },
    });
  }
  push(path: string) {
    this.setPendingRoute((path) => {
      history.pushState({}, "", path);
    }, path);
  }
  get goto() {
    return this.push.bind(this);
  }
  replace(path: string) {
    this.setPendingRoute((path) => {
      history.replaceState({}, "", path);
    }, path);
  }
}
