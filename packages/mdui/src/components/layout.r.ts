import { Content, Context, D, OutputComponent } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdLayout")
export class MdLayout extends OutputComponent {
  main(_: Context, inner: D<Content>): void {
    _._mdui_layout({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdLayout: MdLayout;
  }
}
