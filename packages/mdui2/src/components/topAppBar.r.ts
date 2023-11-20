import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdTopAppBar")
export class MdTopAppBar extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>): void {
    _._mdui_top_app_bar({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdTopAppBar: MdTopAppBar;
  }
}
