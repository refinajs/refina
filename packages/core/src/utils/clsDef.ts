import { Context } from "../context";

export function $clsStr<const S extends string>(cls: S): S;
export function $clsStr(template: TemplateStringsArray, ...args: any[]): string;
export function $clsStr(s: string | TemplateStringsArray, ...args: any[]) {
  if (typeof s === "string") {
    return s;
  }
  return String.raw(s, ...args);
}

export function $clsFunc(cls: string): (_: Context) => true;
export function $clsFunc(
  template: TemplateStringsArray,
  ...args: any[]
): (_: Context) => true;
export function $clsFunc(...args: any[]) {
  //@ts-ignore
  return (_: Context) => _.$cls(...args);
}
