import { Prelude } from "../constants";
import { Content } from "../dom";

declare module "../component" {
  interface Components {
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
    embed<Args extends any[]>(content: Content<Args>, ...args: Args): void;
  }
}

Prelude.outputComponents.embed = function (_) {
  return (content, ...args) => {
    if (typeof content === "function") {
      try {
        content(_, ...args);
        if (import.meta.env.DEV) {
          _.$lowlevel.$$assertEmpty();
        }
      } catch (e) {
        this.$app.callHook("onError", e);
      }
    } else {
      _.$lowlevel.$$t("_t", content);
    }
  };
};

/**
 * A function that returns a promise of a object whose default export is a content.
 *
 * @example
 * ```ts
 * const loader: AsyncContentLoader = () => import("./myView.ts");
 * ```
 */
export type AsyncContentLoader<Args extends any[]> = () => Promise<{
  default: Content<Args>;
}>;

declare module "../component" {
  interface Components {
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
    asyncEmbed<Args extends any[]>(
      contentLoader: AsyncContentLoader<Args>,
      ...args: Args
    ): void;
  }
}

Prelude.outputComponents.asyncEmbed = function (_) {
  let loadedContent: Content<any> | null = null;
  return (contentLoader, ...args) => {
    if (loadedContent) {
      _.embed(loadedContent, ...args);
    } else {
      contentLoader().then(v => {
        loadedContent = v.default;
        _.$update();
      });
    }
  };
};
