import { Content, Context, D, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdTopAppBar")
export class MdTopAppBar extends OutputComponent {
  main(_: Context, inner: D<Content>): void {
    _._mdui_top_app_bar({}, inner);
  }
}

@MdUI2.outputComponent("mdTopAppBarTitle")
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
