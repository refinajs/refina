import { Context, contextFuncs } from "../context";

const maybeSymbol = Symbol("nothing");

export interface Nothing<T extends {}> {
  [maybeSymbol]: true;
  _hasSomething: false;
  _value: undefined;
  get value(): undefined;
  set value(value: T);
  clear(): true;
}
export interface Just<T extends {}> {
  [maybeSymbol]: true;
  _hasSomething: true;
  _value: T;
  get value(): T;
  set value(value: T);
  clear(): true;
}

export type Maybe<T extends {}> = Nothing<T> | Just<T>;

export function nothing(): Nothing<any> {
  return {
    [maybeSymbol]: true,
    _hasSomething: false,
    _value: undefined,
    set value(value: any) {
      //@ts-ignore
      this[maybeSymbol] = true;
      this._value = value;
    },
    get value() {
      return this._value;
    },
    clear() {
      this._hasSomething = false;
      this._value = undefined;
      return true;
    },
  };
}

export function maybe<T extends {}>(value?: T): Maybe<T> {
  if (value === undefined) {
    return nothing();
  }
  return {
    [maybeSymbol]: true,
    _hasSomething: true,
    _value: value,
    get value() {
      return this._value!;
    },
    set value(value: T) {
      this._value = value;
    },
    clear() {
      (this as Maybe<T>)._hasSomething = false;
      (this as Maybe<T>)._value = undefined;
      return true;
    },
  };
}

export function isMaybe(m: undefined | null): false;
export function isMaybe<T extends {}>(m: Maybe<T>): m is Maybe<T>;
export function isMaybe(m: {}): m is Maybe<any>;
export function isMaybe(m: any): m is Maybe<any> {
  return m !== undefined && m !== null && m[maybeSymbol];
}

export function hasNothing<T extends {}>(m: Maybe<T>): m is Nothing<T>;
export function hasNothing(m: {}): m is Nothing<any>;
export function hasNothing(m: {}) {
  return (
    m[maybeSymbol as keyof {}] && (m as Maybe<any>)._hasSomething === false
  );
}

export function justSomething<T extends {}>(m: Maybe<T>): m is Just<T>;
export function justSomething(m: {}): m is Just<any>;
export function justSomething(m: {}) {
  return m[maybeSymbol as keyof {}] && (m as Maybe<any>)._hasSomething === true;
}

contextFuncs["$setMaybe"] = function <T extends {}>(
  this: Context,
  m: Maybe<T>,
  value: T,
) {
  m.value = value;
  this.$update();
};

contextFuncs["$clearMaybe"] = function (this: Context, m: Maybe<any>) {
  m.clear();
  this.$update();
};

declare module "../context" {
  interface CustomContext<C> {
    $setMaybe<T extends {}>(m: Maybe<T>, value: T): void;
    $clearMaybe(m: Maybe<any>): void;
  }
}
