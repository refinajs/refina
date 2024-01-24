import { Components } from "../component";
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
export function ref<T = PrimaryElOwner>(current: T | null = null): Ref<T> {
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
 * Something that has a primary element.
 */
type PrimaryElOwner<T extends DOMElementComponent = DOMElementComponent> = {
  readonly $primaryEl: T | undefined;
};

/**
 * A reference to a something that has a primary element.
 */
export type PrimaryElRef<T extends DOMElementComponent = DOMElementComponent> =
  Ref<PrimaryElOwner<T>>;

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
export type ComponentRef<N extends keyof Components> = Ref<Components[N]>;

/**
 * Create a `Ref` object refs to a component.
 *
 * @param current The initial value of the `current` property.
 * @returns The `Ref` object.
 */
export function componentRef<N extends keyof Components>(
  current: Components[N] | null = null,
): ComponentRef<N> {
  return { current };
}
