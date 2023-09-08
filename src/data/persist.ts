import { DFactory, createDWarpper, customFactoryMethods } from "./factory";

declare module "./factory" {
  interface CustomDFactoryMember<T> {
    persist(storage: Storage, key: string): DFactory<T>;
  }
}

customFactoryMethods.persist =
  (factory: DFactory<any>) => (storage: Storage, key: string) =>
    createDWarpper<any>(
      factory,
      (v) => {
        const item = storage.getItem(key);
        if (item === null) {
          storage.setItem(key, JSON.stringify(v));
          return v;
        }
        return JSON.parse(item);
      },
      null,
      (v) => {
        storage.setItem(key, JSON.stringify(v));
        return v;
      },
    );
