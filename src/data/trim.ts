import { customFactoryMethods, createDWarpper, DFactory } from "./factory";

declare module "./factory" {
  interface CustomDFactoryMember<T> {
    trim: string extends T ? DFactory<string> : never;
  }
}
customFactoryMethods.trim = (factory: DFactory<string>) =>
  createDWarpper(
    factory,
    (x) => x.trim(),
    (x) => x.trim(),
    (x) => x.trim(),
  );
