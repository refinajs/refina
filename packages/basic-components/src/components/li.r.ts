import { Content, D } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    li(inner: D<Content>): void;
  }
}

Basics.outputComponents.li = function (_) {
  return inner => {
    _._li({}, inner);
  };
};
