import { PD, PDSymbol } from "./data";

/**
 * Extract the keys of an object whose values are satisfied by a type.
 */
type ValueSatisfiedKeys<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

/**
 * A `PD` object that references a property of an object.
 */
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

/**
 * Create a `PD` object that references a property of an object.
 *
 * @param obj The object of the property to reference.
 * @param prop The name of the property to reference.
 * @returns The `PD` object.
 */
export function fromProp<T, O = any>(obj: O, prop: ValueSatisfiedKeys<O, T>) {
  return new PDFromProp(obj, prop);
}
