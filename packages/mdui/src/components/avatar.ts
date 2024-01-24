import { Avatar } from "mdui";
import { Component, _ } from "refina";

export class MdAvatar extends Component {
  $main(src: string, fit?: Avatar["fit"]): void {
    _._mdui_avatar({
      src,
      fit,
    });
  }
}

export class MdIconAvatar extends Component {
  $main(iconName: string): void {
    _._mdui_avatar({
      icon: iconName,
    });
  }
}
