import Basics from "../plugin";

declare module "refina" {
  interface Components {
    img(src: string, alt?: string): void;
  }
}

Basics.outputComponents.img = function (_) {
  return (src, alt = "") => {
    _._img({
      src,
      alt,
    });
  };
};
