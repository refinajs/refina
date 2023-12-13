import Basics from "../plugin";

declare module "refina" {
  interface Components {
    br(): void;
  }
}

Basics.outputComponents.br = function (_) {
  return () => {
    _._br();
  };
};
