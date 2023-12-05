import { Avatar } from "mdui";
import { Context, D, OutputComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdAvatar")
export class MdAvatar extends OutputComponent {
  main(_: Context, src: D<string>, fit?: D<Avatar["fit"]>): void {
    _._mdui_avatar({
      src: getD(src),
      fit: getD(fit),
    });
  }
}

@MdUI.outputComponent("mdIconAvatar")
export class MdIconAvatar extends OutputComponent {
  main(_: Context, iconName: D<string>): void {
    _._mdui_avatar({
      icon: getD(iconName),
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdAvatar: MdAvatar;
    mdIconAvatar: MdIconAvatar;
  }
}
