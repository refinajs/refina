import { Context, IntrinsicContext, Render } from "../context";
import { OutputComponent, outputComponent } from "./output";

const renderCache = new Map<string, Render<any>>();

@(outputComponent("embed") as <T>(t: T) => T)
export class Embed extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    render:
      | Render<Args>
      | (() => Promise<{
          default: Render<Args>;
        }>),
    ...args: Args
  ): void {
    const context = new IntrinsicContext(_.$view);

    if (renderCache.has(this.ikey)) {
      renderCache.get(this.ikey)!(context as unknown as Context, ...args);
    } else {
      const ret = render(context as unknown as Context, ...args);
      if (ret instanceof Promise) {
        _.t`Loading module...`;
        ret.then((r) => {
          renderCache.set(this.ikey, r.default);
          r.default(context as unknown as Context, ...args);
          _.$view.update();
        });
      }
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    embed<Args extends any[]>(
      render:
        | Render<Args>
        | (() => Promise<{
            default: Render<Args>;
          }>),
      ...args: Args
    ): void;
  }
}
