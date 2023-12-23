import { Context, OutputComponent } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdDivider(): void;
  }
}
MdUI.outputComponents.mdDivider = function (_) {
  return () => {
    _._mdui_divider();
  };
};

declare module "refina" {
  interface Components {
    mdVerticalDivider(): void;
  }
}
MdUI.outputComponents.mdVerticalDivider = function (_) {
  return () => {
    _._mdui_divider({
      vertical: true,
    });
  };
};
