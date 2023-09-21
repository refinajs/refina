import { Context } from "../context";

export function $cls(cls: string): (_: Context) => true;
export function $cls(
  template: TemplateStringsArray,
  ...args: any[]
): (_: Context) => true;
export function $cls(...args: any[]) {
  //@ts-ignore
  return (_: Context) => _.$cls(...args);
}
