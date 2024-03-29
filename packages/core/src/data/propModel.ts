import { toModelValue, JustModel } from "./model";

/**
 * Create a model that references a property of an object.
 *
 * @param obj The object of the property to reference.
 * @param key The key of the property to reference.
 * @returns The model.
 */
export function propModel<T, K extends keyof T>(obj: T, key: K) {
  return {
    obj,
    key,

    get value() {
      return this.obj[this.key];
    },
    set value(v: T[K]) {
      this.obj[this.key] = v;
    },

    [toModelValue]() {
      return this.value;
    },
    [Symbol.toPrimitive]() {
      return this.value;
    },
  } as JustModel<T[K]> & { obj: T; key: K };
}
