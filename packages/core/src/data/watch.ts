import { PD } from "./base";
import { DFactory, createDWarpper, customFactoryMethods } from "./factory";

declare module "./factory" {
  interface CustomDFactoryMember<T> {
    watch(
      watcher: (after: T, before: T | undefined, d: PD<T>) => void,
      immediate: true,
    ): DFactory<T>;
    watch(
      watcher: (after: T, before: T, d: PD<T>) => void,
      immediate?: false,
    ): DFactory<T>;
  }
}

customFactoryMethods.watch =
  <T>(factory: DFactory<T>) =>
  (
    watcher: (after: T, before: T | undefined, d: PD<T>) => void,
    immediate = false,
  ) =>
    createDWarpper(
      factory,
      immediate
        ? (v, d) => {
            watcher(v, undefined, d as PD<T>);
            return v;
          }
        : null,
      null,
      (v, d) => {
        watcher(v, d.value, d as PD<T>);
        return v;
      },
    );
