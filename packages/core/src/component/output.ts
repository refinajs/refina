import { Context } from "../context";
import { Component, Components } from "./component";

/**
 * The base class of all output components.
 *
 * An output component is a component that has no status and no trigger.
 * i.e. context functions of output components have no return value.
 */
export class OutputComponent<Props = {}> extends Component<Props> {}

/**
 * The name of all output components.
 */
export type OutputComponentName = {
  [K in keyof Components]: ((...args: any[]) => void) extends Components[K]
    ? K
    : never;
}[keyof Components];

/**
 * The factory function of an output component.
 */
export type OutputComponentFactory<N extends OutputComponentName> = (
  this: Readonly<OutputComponent>,
  _: Context,
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
export function createOutputComponentFunc(
  factory: OutputComponentFactory<OutputComponentName>,
) {
  return function (this: Context, ckey: string, ...args: unknown[]): void {
    this.$intrinsic.$$processComponent(ckey, OutputComponent, factory, args);
  };
}
