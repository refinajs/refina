import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdToolbar")
export class MdToolbar extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>, colored: D<boolean> = true): void {
    _.$cls`mdui-toolbar`;
    if (colored) {
      _.$cls`mdui-color-theme`;
    }
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdToolbar: MdToolbar;
  }
}
