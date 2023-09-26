import { Context, IntrinsicContext, View } from "../context";
import { OutputComponent, outputComponent } from "./output";

const viewCache = new Map<string, View<any>>();

@outputComponent("embed")
export class Embed extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    view:
      | View<Args>
      | (() => Promise<{
          default: View<Args>;
        }>),
    ...args: Args
  ): void {
    const context = new IntrinsicContext(_.$app);

    if (viewCache.has(this.ikey)) {
      viewCache.get(this.ikey)!(context as unknown as Context, ...args);
    } else {
      const ret = view(context as unknown as Context, ...args);
      if (ret instanceof Promise) {
        _.t`Loading module...`;
        ret.then((r) => {
          viewCache.set(this.ikey, r.default);
          r.default(context as unknown as Context, ...args);
          _.$app.update();
        });
      }
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    embed: never extends C
      ? <Args extends any[]>(
          view:
            | View<Args>
            | (() => Promise<{
                default: View<Args>;
              }>),
          ...args: Args
        ) => void
      : never;
  }
}
