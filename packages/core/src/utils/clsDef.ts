import { Context } from "../context";

/**
 * Create a class name string.
 *
 * @param cls The class name.
 */
export function $clsStr<const S extends string>(cls: S): S;
/**
 * Create a class name string.
 *
 * @param template The template string of the class name.
 * @param args The arguments of the template string.
 */
export function $clsStr(
  template: TemplateStringsArray,
  ...args: unknown[]
): string;
export function $clsStr(s: string | TemplateStringsArray, ...args: unknown[]) {
  if (typeof s === "string") {
    return s;
  }
  return String.raw(s, ...args);
}

/**
 * Create a function that applies the given class name to the context.
 *
 * @param cls The class name.
 */
export function $clsFunc(cls: string): (_: Context) => true;
/**
 * Create a function that applies the given class name to the context.
 *
 * @param template The template string of the class name.
 * @param args The arguments of the template string.
 */
export function $clsFunc(
  template: TemplateStringsArray,
  ...args: unknown[]
): (_: Context) => true;
export function $clsFunc(...args: unknown[]) {
  // @ts-ignore
  return (_: Context) => _.$cls(...args);
}
