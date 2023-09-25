import { PDType } from "./base";
import { DFactory, createDWarpper, customFactoryMethods } from "./factory";

declare module "./factory" {
  interface CustomDFactoryMember<T> {
    watch(
      watcher: (after: T, before: T | undefined, d: PDType<T>) => void,
      immediate: true,
    ): DFactory<T>;
    watch(
      watcher: (after: T, before: T, d: PDType<T>) => void,
      immediate?: false,
    ): DFactory<T>;
  }
}

customFactoryMethods.watch =
  <T>(factory: DFactory<T>) =>
  (
    watcher: (after: T, before: T | undefined, d: PDType<T>) => void,
    immediate = false,
  ) =>
    createDWarpper(
      factory,
      immediate
        ? (v, d) => {
            watcher(v, undefined, d as PDType<T>);
            return v;
          }
        : null,
      null,
      (v, d) => {
        watcher(v, d.value, d as PDType<T>);
        return v;
      },
    );
