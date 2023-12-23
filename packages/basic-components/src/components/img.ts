import { D, getD } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    img(src: D<string>, alt?: D<string>): void;
  }
}

Basics.outputComponents.img = function (_) {
  return (src, alt = "") => {
    _._img({
      src: getD(src),
      alt: getD(alt),
    });
  };
};
