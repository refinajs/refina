import { ComponentContext, D, OutputComponent, getD } from "refina";
import type { IconName } from "./icon.asset";
// import { fontMap } from "./icon.asset";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdIcon")
export class MdIcon extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<IconName>): void {
    _.$cls`mdui-icon` && _.$cls`material-icons`;
    // _._i({}, fontMap[getD(inner)]);
    _._i({}, getD(inner)); // I don't know why but it works
  }
}

declare module "refina" {
  interface OutputComponents {
    mdIcon: MdIcon;
  }
}
