import { Context, IntrinsicContext } from "../context";
import { Content } from "../dom";
import { OutputComponent, outputComponent } from "../component/output";
import { D, getD } from "../data";

const contentCache = new Map<string, Content<any>>();

@outputComponent("embed")
export class Embed extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    content: D<
      | Content<Args>
      | (() => Promise<{
          default: Content<Args>;
        }>)
    >,
    ...args: Args
  ): void {
    const contentValue = getD(content);

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
      if (typeof contentValue === "function") {
        const ret = contentValue(context as unknown as Context, ...args);
        if (ret instanceof Promise) {
          _.t`Loading module...`;
          ret.then((r) => {
            contentCache.set(this.ikey, r.default);
            processContent(r.default);
            _.$app.update();
          });
        }
      } else {
        _.t(String(contentValue));
      }
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    embed: never extends C
      ? <Args extends any[]>(
          content: D<
            | Content<Args>
            | (() => Promise<{
                default: Content<Args>;
              }>)
          >,
          ...args: Args
        ) => void
      : never;
  }
}
