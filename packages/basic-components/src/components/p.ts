import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    p(inner: Content): void;
  }
}

Basics.outputComponents.p = function (_) {
  return inner => {
    _._p({}, inner);
  };
};
