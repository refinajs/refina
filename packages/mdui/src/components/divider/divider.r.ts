import { OutputComponent, ComponentContext } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdDivider")
export class MdDivider extends OutputComponent {
  main(_: ComponentContext<this>): void {
    _.$cls`mdui-divider`;
    _._div();
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDivider: MdDivider;
  }
}
