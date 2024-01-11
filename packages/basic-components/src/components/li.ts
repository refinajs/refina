import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    li(inner: Content): void;
  }
}

Basics.outputComponents.li = function (_) {
  return inner => {
    _._li({}, inner);
  };
};
