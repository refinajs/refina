const hasSomethingSymbol = Symbol("nothing");

export type Nothing = {
  [hasSomethingSymbol]: false;
};
export type Just<T extends {}> = {
  [hasSomethingSymbol]: true;
  value: T;
};

export type Maybe<T extends {}> = Nothing | Just<T>;

export const nothing: Nothing = {
  [hasSomethingSymbol]: false,
};

export function maybe<T extends {}>(value?: T): Maybe<T> {
  if (value === undefined) {
    return nothing;
  }
  return {
    [hasSomethingSymbol]: true,
    value,
  };
}

export function isMaybe(m: undefined | null): false;
export function isMaybe<T extends {}>(m: Maybe<T>): m is Maybe<T>;
export function isMaybe(m: {}): m is Maybe<any>;
export function isMaybe(m: any): m is Maybe<any> {
  return (
    m !== undefined &&
    m !== null &&
    (m[hasSomethingSymbol] === true || m[hasSomethingSymbol] === false)
  );
}

export function hasNothing(m: {}): m is Nothing {
  return m[hasSomethingSymbol as keyof {}] === false;
}

export function justSomething<T extends {}>(m: Maybe<T>): m is Just<T>;
export function justSomething(m: {}): m is Just<any>;
export function justSomething(m: {}) {
  return m[hasSomethingSymbol as keyof {}] === true;
}

export function setMaybe<T extends {}>(
  m: Maybe<T>,
  value: T,
): asserts m is Just<T> {
  m[hasSomethingSymbol] = true;
  const j = m as Just<T>;
  j.value = value;
}

export function clearMaybe<T extends {}>(m: Maybe<T>): asserts m is Nothing {
  m[hasSomethingSymbol] = false;
}
