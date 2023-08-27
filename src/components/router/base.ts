import { Render } from "../../context";
import { View } from "../../view";

export type Routes = Record<
  string,
  Promise<{
    default: Render;
  }>
>;

export class Router {
  constructor(public routes: Routes) {}

  view: View;
  current: Render;

  async mount() {
    globalRouter = this;
    window.addEventListener(
      "hashchange",
      async ({ oldURL, newURL }) => {
        this.current = (await this.routes[newURL as any]).default;
        this.view.update();
      },
      false,
    );
    this.current = (await this.routes["/"]).default;
    this.view?.update();
  }
}

export var globalRouter: Router | null = null;

export function router(routes: Routes) {
  const router = new Router(routes);
  router.mount();
  return router;
}
