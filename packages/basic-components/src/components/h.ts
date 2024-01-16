import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    h1(inner: Content): void;
    h2(inner: Content): void;
    h3(inner: Content): void;
    h4(inner: Content): void;
    h5(inner: Content): void;
    h6(inner: Content): void;
  }
}

Basics.outputComponents.h1 = function (_) {
  return inner => {
    _._h1({}, inner);
  };
};

Basics.outputComponents.h2 = function (_) {
  return inner => {
    _._h2({}, inner);
  };
};

Basics.outputComponents.h3 = function (_) {
  return inner => {
    _._h3({}, inner);
  };
};

Basics.outputComponents.h4 = function (_) {
  return inner => {
    _._h4({}, inner);
  };
};

Basics.outputComponents.h5 = function (_) {
  return inner => {
    _._h5({}, inner);
  };
};

Basics.outputComponents.h6 = function (_) {
  return inner => {
    _._h6({}, inner);
  };
};
