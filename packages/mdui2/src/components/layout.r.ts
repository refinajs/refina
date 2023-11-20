import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdLayout")
export class MdLayout extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>): void {
    _._mdui_layout({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdLayout: MdLayout;
  }
}
