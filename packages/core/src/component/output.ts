import { IntrinsicBaseContext } from "../context";
import {
  Component,
  ComponentContext,
  ComponentExposedKey,
  ComponentProps,
  ComponentPropsKey,
  Components,
  createComponentDefiner,
} from "./component";

/**
 * The base class of all output components.
 *
 * An output component is a component that has no status and no trigger.
 * i.e. context functions of output components have no return value.
 */
export class OutputComponent<Props> extends Component<Props> {}

/**
 * The name of all output components.
 */
export type OutputComponentName = {
  [K in keyof Components]: K extends ComponentPropsKey | ComponentExposedKey
    ? never
    : ((...args: any) => void) extends Components[K]
    ? K
    : never;
}[keyof Components];

/**
 * The factory function of an output component.
 */
export type OutputComponentFactory<
  N extends OutputComponentName = OutputComponentName,
> = (
  this: OutputComponent<ComponentProps<N>>,
  _: ComponentContext<N>,
) => Components[N];

/**
 * The output component factory function map.
 */
export type OutputComponentFactoryMap = {
  [N in OutputComponentName]: OutputComponentFactory<N>;
};

/**
 * Create a context function of a output component.
 *
 * @param ctor The component class.
 * @returns The context function.
 */
export function createOutputComponentFunc(factory: OutputComponentFactory) {
  return function (
    this: IntrinsicBaseContext,
    ckey: string,
    ...args: unknown[]
  ): void {
    this.$$processComponent(ckey, OutputComponent, factory, args);
  };
}

/**
 * Define an output component.
 *
 * @param factory The factory function.
 */
export const $defineOutput = createComponentDefiner(createOutputComponentFunc);

declare module "./component" {
  interface ComponentRefTypeRawMap {
    outputComponents: {
      [N in OutputComponentName]: OutputComponent<ComponentProps<N>> &
        ComponentExposed<N>;
    };
  }
}
