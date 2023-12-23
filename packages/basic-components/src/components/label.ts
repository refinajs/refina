import { Content, D } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    label(inner: D<Content>): void;
  }
}

Basics.outputComponents.label = function (_) {
  return inner => {
    _._label({}, inner);
  };
};
