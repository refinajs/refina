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
declare module ".." {
  interface ContextFuncs {
    /**
     * Render a text node.
     *
     * @example
     * ```ts
     * _.t`Hello, world!`;
     * _.t(message);
     * ```
     */
    t(template: TemplateStringsArray, ...args: unknown[]): void;
    t(text: string): void;
  }
}
