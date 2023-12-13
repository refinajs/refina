import { Content, D } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    p(inner: D<Content>): void;
  }
}

Basics.outputComponents.p = function (_) {
  return inner => {
    _._p({}, inner);
  };
};
