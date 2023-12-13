import { Content, D, getD } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    a(inner: D<Content>, href: D<string>): void;
  }
}

Basics.outputComponents.a = function (_) {
  return (inner, href) => {
    _._a(
      {
        href: getD(href),
      },
      inner,
    );
  };
};
