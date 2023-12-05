import { Context, OutputComponent } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdIcon")
export class MdIcon extends OutputComponent {
  main(_: Context, name: string): void {
    _._mdui_icon({
      name: name,
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdIcon: MdIcon;
  }
}
