import type { ComponentRefTypeMap } from "../component";
import type { DOMElementComponent, DOMElementTagNameMap } from "../dom";

/**
 * A nullable reference to an object.
 *
 * Commonly used to reference a component.
 *
 * **Note**: The `current` property of the `Ref` object can be `null`,
 *  which is the biggest difference to a model.
 */
export interface Ref<T> {
  /**
   * The referenced object.
   */
  current: T | null;
}

/**
 * Create a `Ref` object.
 *
 * **Note**: If type of the referenced object is not specified,
 *  it defaults to something that has a `main` element.
 *
 * @param current The initial value of the `current` property.
 * @returns The `Ref` object.
 */
export function ref<T = MainElOwner>(current: T | null = null): Ref<T> {
  return { current };
}

/**
 * A `Ref` object that merges multiple `Ref` objects.
 */
export interface MergedRef<T> extends Ref<T> {
  mergedCurrent: T | null;
}

/**
 * Create a `Ref` object that merges multiple `Ref` objects.
 *
 * @param refs The `Ref` objects to merge.
 * @returns The merged `Ref` object.
 */
export function mergeRefs<T>(...refs: Ref<T>[]): MergedRef<T> {
  return {
    mergedCurrent: null,
    get current() {
      return this.mergedCurrent;
    },
    set current(v) {
      this.mergedCurrent = v;
      refs.forEach(ref => {
        ref.current = v;
      });
    },
  };
}

/**
 * Something that has a main element.
 */
type MainElOwner<T extends DOMElementComponent = DOMElementComponent> = {
  readonly $mainEl: T | undefined;
};

/**
 * A reference to a something that has a main element.
 */
export type MainElRef<T extends DOMElementComponent = DOMElementComponent> =
  Ref<MainElOwner<T>>;

/**
 * A reference to a DOM element.
 */
export type ElementRef<E extends keyof DOMElementTagNameMap> = Ref<
  DOMElementComponent<E>
>;

/**
 * Create a `Ref` object refs to a DOM element component.
 *
 * @param current The initial value of the `current` property.
 * @returns The `Ref` object.
 */
export function elementRef<E extends keyof DOMElementTagNameMap>(
  current: DOMElementComponent<E> | null = null,
): Ref<DOMElementComponent<E>> {
  return { current };
}

/**
 * A reference to a component.
 */
export type ComponentRef<N extends keyof ComponentRefTypeMap> = Ref<
  ComponentRefTypeMap[N]
>;

/**
 * Create a `Ref` object refs to a component.
 *
 * @param current The initial value of the `current` property.
 * @returns The `Ref` object.
 */
export function componentRef<N extends keyof ComponentRefTypeMap>(
  current: ComponentRefTypeMap[N] | null = null,
): Ref<ComponentRefTypeMap[N]> {
  return { current };
}
