import { IntrinsicPD, PD } from "./base";

export interface CustomDFactoryMember<T> {}

export type DFactory<T> = {
  <V extends T>(v: V): PD<V>;
  $initializer: (v: T, d: PD<T>) => T;
  $getter: (v: T, d: PD<T>) => T;
  $setter: (v: T, d: PD<T>) => T;
} & CustomDFactoryMember<T>;

export function createDFactory<T>(
  $initializer: (v: T, d: PD<T>) => T,
  $getter: (v: T, d: PD<T>) => T,
  $setter: (v: T, d: PD<T>) => T,
) {
  const factory = (v: any) => {
    return new IntrinsicPD(
      v,
      factory.$initializer,
      factory.$getter,
      factory.$setter,
    ) as any as PD<T>;
  };
  factory.$initializer = $initializer;
  factory.$getter = $getter;
  factory.$setter = $setter;
  return new Proxy(factory, {
    get(target, key) {
      if (key in target) {
        //@ts-ignore
        return target[key];
      }
      if (key in customFactoryMethods) {
        //@ts-ignore
        return customFactoryMethods[key](target);
      }
    },
  }) as unknown as DFactory<T>;
}

const identity = (v: unknown) => v;

export const customFactoryMethods = {} as Record<
  keyof CustomDFactoryMember<any>,
  (factory: any) => any
>;

export function createDWarpper<T>(
  factory: DFactory<T>,
  initializer?: ((v: T, d: PD<T>, factory: DFactory<T>) => T) | null,
  getter?: ((v: T, d: PD<T>, factory: DFactory<T>) => T) | null,
  setter?: ((v: T, d: PD<T>, factory: DFactory<T>) => T) | null,
) {
  return createDFactory<T>(
    initializer
      ? (v, d) => factory.$initializer(initializer(v, d, factory), d)
      : factory.$initializer,
    getter
      ? (v, d) => getter(factory.$getter(v, d), d, factory)
      : factory.$getter,
    setter
      ? (v, d) => factory.$setter(setter(v, d, factory), d)
      : factory.$setter,
  );
}

export const d = createDFactory<any>(identity, identity, identity);
