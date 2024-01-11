import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    label(inner: Content): void;
  }
}

Basics.outputComponents.label = function (_) {
  return inner => {
    _._label({}, inner);
  };
};
