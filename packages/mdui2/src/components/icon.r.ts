import { Context, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdIcon")
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
