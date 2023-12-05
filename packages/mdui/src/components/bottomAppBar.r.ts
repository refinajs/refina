import { Content, Context, D, OutputComponent } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdBottomAppBar")
export class MdBottomAppBar extends OutputComponent {
  main(_: Context, inner: D<Content>): void {
    _._mdui_bottom_app_bar({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdBottomAppBar: MdBottomAppBar;
  }
}
