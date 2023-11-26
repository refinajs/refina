export const PDSymbol = Symbol("PD");

export interface PD<T> {
  value: T;
  [PDSymbol]: true;
  [Symbol.toPrimitive](): T;
}

export type D<T> = T | PD<T>;

export function d<T>(v: T): PD<T> {
  return {
    value: v,
    [PDSymbol]: true,
    [Symbol.toPrimitive]() {
      return this.value;
    },
  };
}

export function isD<T>(d: D<T>): d is PD<T> {
  return (
    d !== undefined && d !== null && (d[PDSymbol as keyof D<T>] as boolean)
  );
}

export function getD<T>(d: D<T>): T {
  return isD(d) ? d.value : d;
}

/**
 * @returns `true` if the value is changed
 */
export function dangerously_setD<T>(d: D<T>, v: T): boolean {
  //@ts-ignore
  if (d[PDSymbol] && (d as PD<T>).value !== v) {
    (d as PD<T>).value = v;
    return true;
  }
  return false;
}

export type DArray<T> = D<D<T>[]>;
export type DReadonlyArray<T> = D<readonly D<T>[]>;

export function getDArray<T>(d: DReadonlyArray<T>): T[] {
  return getD(d).map(getD);
}

export type DRecord<K extends string | number | symbol, V> = D<Record<K, D<V>>>;
export type DPartialRecord<K extends string | number | symbol, V> = D<
  Partial<Record<K, D<V>>>
>;
