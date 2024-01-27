import { Component } from "../component";
import { Context, _ } from "../context";
import { Content } from "../dom";

export class Embed extends Component {
  /**
   * Embed a content into the current output component.
   *
   * @param content The content to embed.
   * @param args The arguments to pass to the content, if the content is a view function.
   */
  $main<Args extends [any, ...any[]]>(
    content: Content<Args>,
    ...args: [_: Context] extends Args ? Args | [] : Args
  ): void {
    if (typeof content === "function") {
      if (import.meta.env.DEV) {
        _.$lowlevel.$$assertEmpty();
      }
      try {
        content(...((args.length === 0 ? [_] : args) as Args));
      } catch (e) {
        this.$app.callHook("onError", e);
      }
      if (import.meta.env.DEV) {
        _.$lowlevel.$$assertEmpty();
      }
    } else {
      _.$lowlevel.$$t("_t", content);
    }
  }
}

/**
 * A function that returns a promise of a object whose default export is a content.
 *
 * @example
 * ```ts
 * const loader: AsyncContentLoader = () => import("./myView.ts");
 * ```
 */
export type AsyncContentLoader<Args extends [any, ...any[]]> = () => Promise<{
  default: Content<Args>;
}>;

export class AsyncEmbed extends Component {
  loadedContent: Content<any> | null = null;
  /**
   * Like `embed`, but the content is loaded asynchronously.
   *
   * @example
   * ```ts
   * _.asyncEmbed(() => import("./myView.ts"));
   * ```
   *
   * @param contentLoader A function that returns a promise of a object whose default export is a content.
   * @param args The arguments to pass to the content, if the content is a view function.
   */
  $main<Args extends [any, ...any[]]>(
    contentLoader: AsyncContentLoader<Args>,
    ...args: [_: Context] extends Args ? Args | [] : Args
  ): void {
    if (this.loadedContent) {
      _.embed(this.loadedContent, ...args);
    } else {
      contentLoader().then(v => {
        this.loadedContent = v.default;
        this.$update();
      });
    }
  }
}
