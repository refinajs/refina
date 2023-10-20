export interface Ref<T> {
  current: T | null;
}

export function ref<T = MainEl>(current: T | null = null): Ref<T> {
  return { current };
}

export interface MergedRef<T> extends Ref<T> {
  mergedCurrent: T | null;
}

export function mergeRefs<T>(...refs: Ref<T>[]): MergedRef<T> {
  return {
    mergedCurrent: null,
    get current() {
      return this.mergedCurrent;
    },
    set current(v) {
      this.mergedCurrent = v;
      refs.forEach((ref) => {
        ref.current = v;
      });
    },
  };
}

type MainEl<T extends HTMLElement = HTMLElement> = {
  readonly $mainEl: T | null;
};

export type MainElRef<T extends HTMLElement = HTMLElement> = Ref<MainEl<T>>;
