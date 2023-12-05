import { Content, Context, D, OutputComponent } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdTopAppBar")
export class MdTopAppBar extends OutputComponent {
  main(_: Context, inner: D<Content>): void {
    _._mdui_top_app_bar({}, inner);
  }
}

@MdUI.outputComponent("mdTopAppBarTitle")
export class MdTopAppBarTitle extends OutputComponent {
  main(_: Context, inner: D<Content>): void {
    _._mdui_top_app_bar_title({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdTopAppBar: MdTopAppBar;
    mdTopAppBarTitle: MdTopAppBarTitle;
  }
}
