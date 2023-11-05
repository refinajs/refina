import { PD, PDSymbol } from "./base";

type ValueSatisfiedKeys<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

export class PDFromProp<T, O = any> implements PD<T> {
  constructor(
    public $obj: O,
    public $prop: ValueSatisfiedKeys<O, T>,
  ) {}

  get value() {
    return this.$obj[this.$prop] as T;
  }
  set value(v: T) {
    this.$obj[this.$prop] = v as any;
  }

  [PDSymbol] = true as const;
  [Symbol.toPrimitive](): T {
    return this.value;
  }
}

export function fromProp<T, O = any>(obj: O, prop: ValueSatisfiedKeys<O, T>) {
  return new PDFromProp(obj, prop);
}
