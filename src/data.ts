export const PDSymbol = Symbol("PD");

export class PD<T> {
  constructor(public value: T) {}
  [PDSymbol] = true;
  [Symbol.toPrimitive]() {
    return this.value;
  }
}

export function d<T>(v: T): Readonly<T> & PD<T> {
  return new PD(v) as any as Readonly<T> & PD<T>;
}

export type D<T> = T | PD<T>;

export function getD<T>(d: D<T>): T {
  //@ts-ignore
  return d !== undefined && d[PDSymbol] ? (d as PD<T>).value : (d as T);
}

export function dangerously_setD<T>(d: D<T>, v: T): boolean {
  //@ts-ignore
  if (d[PDSymbol]) {
    (d as PD<T>).value = v;
    return true;
  }
  return false;
}

export function toRaw<T extends object>(d: T): T {
  for (const key in d) {
    d[key] = getD(d[key]);
  }
  return d as T;
}

export interface Ref<T> {
  current: T | null;
}

export function ref<T extends object>(current: T | null = null): Ref<T> {
  return { current };
}
