import { OutputComponent } from "../component";
import { Prelude } from "../constants";
import { Context, IntrinsicContext } from "../context";
import { D, getD } from "../data";
import { Content } from "../dom";

@Prelude.outputComponent("embed")
export class Embed extends OutputComponent {
  main<Args extends any[]>(
    _: Context,
    content: D<Content<Args>>,
    ...args: Args
  ): void {
    const contentValue = getD(content);
    const context = new IntrinsicContext(_.$app);
    if (typeof contentValue === "function") {
      contentValue(context as unknown as Context, ...args);
    } else {
      _.$$t("_t", contentValue);
    }
  }
}

/**
 * A function that returns a promise of a object whose default export is a content.
 *
 * @example
 * ```ts
 * const loader: AsyncContentLoader = () => import("./myView.r.ts");
 * ```
 */
export type AsyncContentLoader<Args extends any[]> = () => Promise<{
  default: Content<Args>;
}>;

@Prelude.outputComponent("asyncEmbed")
export class EmbedAsync<Args extends any[] = any[]> extends OutputComponent {
  loadedContent: Content<Args> | null = null;
  main(
    _: Context,
    contentLoader: D<AsyncContentLoader<Args>>,
    ...args: Args
  ): void {
    if (this.loadedContent) {
      _.embed(this.loadedContent, ...args);
    } else {
      getD(contentLoader)().then(v => {
        this.loadedContent = v.default;
        this.$update();
      });
    }
  }
}

declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Embed a content into the current output component.
     *
     * **Warning**: **DO NOT** call view functions directly in your code,
     *  unless you are **very** sure that the view will only be called once in your view / component.
     *  Use this function instead.
     *
     * @param content The content to embed.
     * @param args The arguments to pass to the content, if the content is a view function.
     */
    embed: Embed extends C["enabled"]
      ? <Args extends any[]>(content: D<Content<Args>>, ...args: Args) => void
      : never;

    /**
     * Like `embed`, but the content is loaded asynchronously.
     *
     * @example
     * ```ts
     * _.asyncEmbed(() => import("./myView.r.ts"));
     * ```
     *
     * @param contentLoader A function that returns a promise of a object whose default export is a content.
     * @param args The arguments to pass to the content, if the content is a view function.
     */
    asyncEmbed: EmbedAsync<any> extends C["enabled"]
      ? <Args extends any[]>(
          contentLoader: D<AsyncContentLoader<Args>>,
          ...args: Args
        ) => void
      : never;
  }
}
