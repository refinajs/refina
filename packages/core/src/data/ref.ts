export interface Ref<T> {
  current: T | null;
}

export function ref<T extends object>(current: T | null = null): Ref<T> {
  return { current };
}
