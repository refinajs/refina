import { Avatar } from "mdui";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdAvatar(src: string, fit?: Avatar["fit"]): void;
  }
}
MdUI.outputComponents.mdAvatar = function (_) {
  return (src, fit) => {
    _._mdui_avatar({
      src,
      fit,
    });
  };
};

declare module "refina" {
  interface Components {
    mdIconAvatar(iconName: string): void;
  }
}
MdUI.outputComponents.mdIconAvatar = function (_) {
  return iconName => {
    _._mdui_avatar({
      icon: iconName,
    });
  };
};
