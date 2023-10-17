import { ComponentContext, Content, D, OutputComponent, getD } from "refina";
import MdUI from "../../plugin";
import { AppbarContent } from "./appbar.const";

@MdUI.outputComponent("mdAppbar")
export class MdAppbar extends OutputComponent {
  main(_: ComponentContext<this>, content: D<AppbarContent>, inner: D<Content>): void {
    _.$cls`mdui-appbar`;
    _.$cls`mdui-appbar-fixed`;
    _._div({}, inner);
    if (getD(content) === "toolbar") {
      _.$app._!.$rootCls`mdui-appbar-with-toolbar`;
    } else if (getD(content) === "tab") {
      _.$app._!.$rootCls`mdui-appbar-with-tab`;
    } else if (getD(content) === "both") {
      _.$app._!.$rootCls`mdui-appbar-with-tab-larger`;
    } else {
      console.info("Why do you want an appbar with nothing inside?");
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    mdAppbar: MdAppbar;
  }
}
