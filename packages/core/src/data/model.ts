/**
 * A unique symbol to identify a model.
 */
export const IsModelSymbol = Symbol("isModel");

/**
 * Since there is no reference or pointer of primitive type in JavaScript,
 *  this is a wrapper of primitive type to make it possible to pass by reference.
 */
export interface JustModel<T> {
  /**
   * The model value.
   */
  value: T;

  /**
   * This is a model.
   */
  [IsModelSymbol]: true;

  /**
   * Convert to primitive value.
   */
  [Symbol.toPrimitive](): T;
}

/**
 * A utility type.
 *
 * Commonly used in component function parameters which accept both primitive type and model.
 */
export type Model<T> = T | JustModel<T>;

/**
 * Create a model.
 *
 * @param v The initial value.
 * @returns The created model.
 */
export function model<T>(v: T): JustModel<T> {
  return {
    value: v,
    [IsModelSymbol]: true,
    [Symbol.toPrimitive]() {
      return this.value;
    },
  };
}

/**
 * Check whether a value is a model.
 *
 * @param m The value to check.
 * @returns Whether the value is a model.
 */
export function isModel<T>(m: Model<T>): m is JustModel<T> {
  return (
    typeof m === "object" &&
    m !== null &&
    (m[IsModelSymbol as keyof Model<T>] as boolean)
  );
}

/**
 * Update the value of a model.
 *
 * **Warning**: This function is dangerous. It will mutate the model value without triggering an `UPDATE` call.
 *
 * @param m The model.
 * @param v The new value.
 * @returns Whether the value is changed.
 */
export function dangerously_updateModel<T>(m: Model<T>, v: T): boolean {
  if (isModel(m) && (m as JustModel<T>).value !== v) {
    (m as JustModel<T>).value = v;
    return true;
  }
  return false;
}
