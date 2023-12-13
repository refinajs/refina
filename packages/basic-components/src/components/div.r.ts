import { Content, D } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    div(inner?: D<Content>): void;
  }
}

Basics.outputComponents.div = function (_) {
  return inner => {
    _._div({}, inner);
  };
};
