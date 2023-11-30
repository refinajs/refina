/**
 * A unique symbol to identify a `PD` object.
 */
export const PDSymbol = Symbol("PD");

/**
 * Since there is no reference or pointer of primitive type in JavaScript,
 *  this is a wrapper of primitive type to make it possible to pass by reference.
 */
export interface PD<T> {
  /**
   * The referenced value.
   */
  value: T;

  /**
   * The symbol to identify the `PD` object.
   */
  [PDSymbol]: true;

  /**
   * Convert the `PD` object to its primitive value.
   *
   * Commonly used by `console.log` and template literals.
   */
  [Symbol.toPrimitive](): T;
}

/**
 * A utility type.
 *
 * Commonly used in component function parameters to allow both primitive type and `PD`.
 */
export type D<T> = T | PD<T>;

/**
 * Create a `PD` object.
 *
 * @param v The value to reference.
 * @returns The `PD` object.
 */
export function d<T>(v: T): PD<T> {
  return {
    value: v,
    [PDSymbol]: true,
    [Symbol.toPrimitive]() {
      return this.value;
    },
  };
}

/**
 * Check whether a value is a `PD` object.
 *
 * @param d The value to check.
 * @returns Whether the value is a `PD` object.
 */
export function isD<T>(d: D<T>): d is PD<T> {
  return (
    d !== undefined && d !== null && (d[PDSymbol as keyof D<T>] as boolean)
  );
}

/**
 * Extract the value of a `D`.
 *
 * If the value is a `PD` object, return its value. Otherwise, return the value itself.
 *
 * @param d The `D` to extract.
 * @returns The extracted value.
 */
export function getD<T>(d: D<T>): T {
  return isD(d) ? d.value : d;
}

/**
 * Set the value of a `D`.
 *
 * **Warning**: This function is dangerous. It will mutate the `D` object without triggering an `UPDATE` call.
 *
 * @param d The `D` to set
 * @param v The value to set
 * @returns Whether the value is changed, i.e. whether `d` is a `PD` and the value is different from the original value.
 */
export function dangerously_setD<T>(d: D<T>, v: T): boolean {
  // @ts-ignore
  if (d[PDSymbol] && (d as PD<T>).value !== v) {
    (d as PD<T>).value = v;
    return true;
  }
  return false;
}

/**
 * A utility type to create an array type that accepts `PD` as its elements and itself.
 *
 * **Note**: It is usually better to use `DReadonlyArray` as parameter type instead of this type to loosen the type constraint.
 */
export type DArray<T> = D<D<T>[]>;

/**
 * A utility type to create a readonly array type that accepts `PD` as its elements and itself.
 */
export type DReadonlyArray<T> = D<readonly D<T>[]>;

/**
 * Extract the value of a `DArray` to a normal array.
 *
 * @param d The `DArray` to extract.
 * @returns The extracted array.
 */
export function getDArray<T>(d: DReadonlyArray<T>): T[] {
  return getD(d).map(getD);
}

/**
 * A utility type to create a record type that accepts `PD` as its values and itself.
 */
export type DRecord<K extends string | number | symbol, V> = D<Record<K, D<V>>>;

/**
 * A utility type to create a partial record type that accepts `PD` as its values and itself.
 */
export type DPartialRecord<K extends string | number | symbol, V> = D<
  Partial<Record<K, D<V>>>
>;
