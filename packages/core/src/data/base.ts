export const PDSymbol = Symbol("PD");

export class IntrinsicPD<T> {
  constructor(
    $value: T,
    protected $initializer: (v: T, d: PD<T>) => T,
    protected $getter: (v: T, d: PD<T>) => T,
    protected $setter: (v: T, d: PD<T>) => T,
  ) {
    this.$value = $initializer($value, this as PD<T>);
  }

  protected $value: T;

  get value() {
    return this.$getter(this.$value, this as PD<T>);
  }
  set value(v: T) {
    this.$value = this.$setter(v, this as PD<T>);
  }

  [PDSymbol] = true;
  [Symbol.toPrimitive]() {
    return this.value;
  }
}

export interface PD<T> {
  value: T;
  [PDSymbol]: true;
  [Symbol.toPrimitive](): T;
}

export type D<T> = T | PD<T>;

export function getD<T>(d: D<T>): T {
  return d !== undefined && d !== null && d[PDSymbol as keyof D<T>]
    ? (d as PD<T>).value
    : (d as T);
}

export type DArray<T> = D<D<T>[]>;

export function getDArray<T>(d: DArray<T>): T[] {
  return getD(d).map(getD);
}

export function dangerously_setD<T>(d: D<T>, v: T): boolean {
  //@ts-ignore
  if (d[PDSymbol]) {
    (d as PD<T>).value = v;
    return true;
  }
  return false;
}
