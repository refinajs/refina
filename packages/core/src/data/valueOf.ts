/**
 * Get the primitive value.
 *
 * @param v Maybe a model.
 * @returns The primitive value.1
 */
export function valueOf<T>(
  v:
    | T
    | {
        [Symbol.toPrimitive](): T;
      },
): T {
  return typeof v === "object" && v !== null
    ? (v as any)[Symbol.toPrimitive]?.() ?? v
    : v;
}
