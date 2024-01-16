import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    a(inner: Content, href: string): void;
  }
}

Basics.outputComponents.a = function (_) {
  return (inner, href) => {
    _._a({ href }, inner);
  };
};
