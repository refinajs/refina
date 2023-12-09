import { Context, ContextState } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
} from "./component";

/**
 * The base class of all output components.
 *
 * An output component is a component that has no status and no trigger.
 * i.e. context functions of output components have no return value.
 *
 * Register the component class using `@Plugin.outputComponent(name)` to make it available.
 */
export abstract class OutputComponent<Props = {}> extends Component<Props> {
  abstract main(_: Context, ...args: any[]): void;
}

/**
 * Create a context function of an output component.
 *
 * @param ctor The component class.
 * @returns The context function.
 */
export function createOutputComponentFunc<
  T extends ComponentConstructor<OutputComponent>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): void {
    this.$$processComponent(ckey, ctor, args);
    return;
  };
}

/**
 * The output components map to add the component functions to the context in one go.
 *
 * Add your output components to this map using declaration merging:
 *
 * ```ts
 * declare module "refina" {
 *   interface OutputComponents {
 *     contextFuncName: ComponentClass;
 *   }
 * }
 * ```
 *
 * The keys are the context function names of the components.
 * And the values are the corresponding component classes.
 *
 * **Warning**: Do not add components that have generic types to this map.
 * Because the types of the component functions are not inferred.
 * Use `ContextFuncs` interface instead.
 */
export interface OutputComponents {}

/**
 * The component functions of output components in `OutputComponents` interface.
 */
export type OutputComponentFuncs<C extends ContextState> = {
  [K in keyof OutputComponents]: OutputComponents[K] extends C["enabled"]
    ? (...args: ComponentFuncArgs<OutputComponents[K]>) => void
    : never;
};

// Add output component functions to the context.
declare module "../context/base" {
  interface ContextFuncs<C> extends OutputComponentFuncs<C> {}
}
