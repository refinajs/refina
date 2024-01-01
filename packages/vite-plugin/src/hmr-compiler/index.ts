import { RefinaDescriptor, compile } from "./compile";

export const cache = new Map<string, RefinaDescriptor | null>();

export function transform(id: string, src: string) {
  const descriptor = cache.get(id) ?? compile(id, src);
  cache.set(id, descriptor);
  return descriptor;
}

/**
 * @returns Can perform HMR.
 */
export function update(id: string, newSrc: string) {
  const oldDescriptor = cache.get(id);
  const newDescriptor = compile(id, newSrc);
  cache.set(id, newDescriptor);
  if (!oldDescriptor || !newDescriptor) return false;
  if (oldDescriptor.locals.code !== newDescriptor.locals.code) return false;
  return true;
}

export { mainUrlSuffix } from "./constants";
