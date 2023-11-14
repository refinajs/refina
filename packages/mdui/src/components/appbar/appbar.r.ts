import { ComponentContext, Content, D, OutputComponent, getD } from "refina";
import MdUI from "../../plugin";
import { appbarClassNameMap, AppbarType } from "./appbar.const";

@MdUI.outputComponent("mdAppbar")
export class MdAppbar extends OutputComponent {
  main(_: ComponentContext, type: D<AppbarType>, inner: D<Content>): void {
    _.$rootCls(appbarClassNameMap[getD(type)]);

    _.$cls`mdui-appbar mdui-appbar-fixed`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdAppbar: MdAppbar;
  }
}
