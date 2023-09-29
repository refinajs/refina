import { Context, IntrinsicContext } from "../context";
import { Content } from "../dom";
import { OutputComponent, outputComponent } from "../component/output";

const contentCache = new Map<string, Content<any>>();

@outputComponent("embed")
export class Embed extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    content:
      | Content<Args>
      | (() => Promise<{
          default: Content<Args>;
        }>),
    ...args: Args
  ): void {
    const context = new IntrinsicContext(_.$app);

    function processContent(content: Content<Args>) {
      if (typeof content === "function") {
        content(context as unknown as Context, ...args);
      } else {
        _.t(String(content));
      }
    }

    if (contentCache.has(this.ikey)) {
      processContent(contentCache.get(this.ikey)!);
    } else {
      if (typeof content === "function") {
        const ret = content(context as unknown as Context, ...args);
        if (ret instanceof Promise) {
          _.t`Loading module...`;
          ret.then((r) => {
            contentCache.set(this.ikey, r.default);
            processContent(r.default);
            _.$app.update();
          });
        }
      } else {
        _.t(String(content));
      }
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    embed: never extends C
      ? <Args extends any[]>(
          content:
            | Content<Args>
            | (() => Promise<{
                default: Content<Args>;
              }>),
          ...args: Args
        ) => void
      : never;
  }
}
