import { RefinaDescriptor, compile } from "./compile";

export class RefinaHmr {
  cache = new Map<string, RefinaDescriptor | null>();

  transform(id: string, src: string) {
    const descriptor = this.cache.get(id) ?? compile(id, src);
    this.cache.set(id, descriptor);
    return descriptor;
  }

  /**
   * @returns Can perform HMR.
   */
  update(id: string, newSrc: string) {
    const oldDescriptor = this.cache.get(id);
    const newDescriptor = compile(id, newSrc);
    this.cache.set(id, newDescriptor);
    if (!oldDescriptor || !newDescriptor) return false;
    if (oldDescriptor.locals.code !== newDescriptor.locals.code) return false;
    return true;
  }
}

export * from "./constants";
