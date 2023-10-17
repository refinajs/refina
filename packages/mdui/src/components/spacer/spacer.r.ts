import { ComponentContext, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdSpacer")
export class MdSpacer extends OutputComponent {
  main(_: ComponentContext<this>): void {
    _.$cls`mdui-toolbar-spacer`;
    _._div();
  }
}

declare module "refina" {
  interface OutputComponents {
    mdSpacer: MdSpacer;
  }
}
