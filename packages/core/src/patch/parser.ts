import { PatchTarget } from "./patch";

export type SelectorNode = (name: string) => false | SelectorNode | PatchTarget;

export function parseSelector(
  selector: string,
  patchTarget: PatchTarget,
): SelectorNode {
  if (!/^(>([a-z_][a-z0-9_]*|\*)(:(\d+|\*))?)+$/i.test(selector)) {
    throw new Error(`Invalid selector: ${selector}`);
  }
  const parts = selector.split(">").slice(1);
  let node: SelectorNode | undefined;
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    const next = node ?? patchTarget;
    const [name, index] = part.split(":");
    if (index === "*") {
      if (name === "*") {
        node = () => next;
      } else {
        node = v => v === name && next;
      }
    } else {
      let n = index ? parseInt(index) : 1;
      if (name === "*") {
        node = () => {
          n--;
          return n === 0 ? next : false;
        };
      } else {
        node = v => {
          if (v !== name) return false;
          n--;
          return n === 0 ? next : false;
        };
      }
    }
  }
  return () => node!;
}
