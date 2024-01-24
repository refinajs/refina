import { IsModelSymbol, JustModel } from "./model";

type ValueSatisfiedKeysImpl<T, O, K extends keyof O> = K extends any
  ? O[K] extends T
    ? K
    : never
  : never;

/**
 * Extract the keys of an object whose values are satisfied by a type.
 */
type ValueSatisfiedKeys<T, O> = ValueSatisfiedKeysImpl<T, O, keyof O>;

/**
 * A model that references a property of an object.
 */
export class PropModel<T, O = any> implements JustModel<T> {
  constructor(
    public $obj: O,
    public $prop: ValueSatisfiedKeys<T, O>,
  ) {}

  get value() {
    return this.$obj[this.$prop] as T;
  }
  set value(v: T) {
    this.$obj[this.$prop] = v as any;
  }

  [IsModelSymbol] = true as const;
  [Symbol.toPrimitive](): T {
    return this.value;
  }
}

/**
 * Create a model that references a property of an object.
 *
 * @param obj The object of the property to reference.
 * @param prop The name of the property to reference.
 * @returns The model.
 */
export function propModel<T, O = any>(obj: O, prop: ValueSatisfiedKeys<T, O>) {
  return new PropModel(obj, prop);
}
