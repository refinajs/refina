import { D } from "../data";
import { DOMNodeComponent } from "./node";

/**
 * Component that contains a text node.
 */
export class TextNodeComponent extends DOMNodeComponent<Text> {
  updateDOM(): null {
    return null;
  }
}

// Add text node function to context.
declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Render a text node.
     *
     * @example
     * ```ts
     * _.t`Hello, world!`;
     * _.t(message);
     * ```
     */
    t: TextNodeComponent extends C["enabled"]
      ? ((template: TemplateStringsArray, ...args: any[]) => void) &
          ((text: D<string>) => void)
      : never;
  }
}
