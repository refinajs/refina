import { OutputComponent } from "../component";
import { Prelude } from "../constants";
import { Context, IntrinsicContext } from "../context";
import { D, getD } from "../data";
import { Content, DOMElementComponent, DOMNodeComponent } from "../dom";

const contentCache = new Map<string, Content<any>>();

type EmbededContent<Args extends any[]> =
  | Content<Args>
  | (() => Promise<{
      default: Content<Args>;
    }>);

@Prelude.outputComponent("embed")
export class Embed extends OutputComponent {
  $firstDOMNode: DOMNodeComponent | null = null;
  $firstHTMLELement: DOMElementComponent | null = null;
  main<Args extends any[]>(_: Context, content: D<EmbededContent<Args>>, ...args: Args): void {
    const contentValue: EmbededContent<Args> = contentCache.get(this.$ikey) ?? getD(content);

    const context = new IntrinsicContext(_.$app);

    if (typeof contentValue === "function") {
      const ret: unknown = contentValue(context as unknown as Context, ...args);
      if (ret instanceof Promise) {
        _.t`Loading module...`;
        ret.then((r) => {
          contentCache.set(this.$ikey, r.default);
          _.$app.update();
        });
      } else {
        _.$firstDOMNode = this.$firstDOMNode = context.$firstDOMNode;
        _.$firstHTMLELement = this.$firstHTMLELement = context.$firstHTMLELement;
      }
    } else {
      _.t(String(contentValue));
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    embed: Embed extends C
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
