import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdIcon(name: string): void;
  }
}
MdUI.outputComponents.mdIcon = function (_) {
  return name => {
    _._mdui_icon({
      name,
    });
  };
};
