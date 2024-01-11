import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    span(inner?: Content): void;
  }
}

Basics.outputComponents.span = function (_) {
  return inner => {
    _._span({}, inner);
  };
};
