import { Avatar } from "mdui";
import { D, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdAvatar(src: D<string>, fit?: D<Avatar["fit"]>): void;
  }
}
MdUI.outputComponents.mdAvatar = function (_) {
  return (src, fit) => {
    _._mdui_avatar({
      src: getD(src),
      fit: getD(fit),
    });
  };
};

declare module "refina" {
  interface Components {
    mdIconAvatar(iconName: D<string>): void;
  }
}
MdUI.outputComponents.mdIconAvatar = function (_) {
  return iconName => {
    _._mdui_avatar({
      icon: getD(iconName),
    });
  };
};
