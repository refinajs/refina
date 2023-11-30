import { Content, Context, D, OutputComponent, getD } from "refina";
import MdUI from "../../plugin";
import { AppbarType, appbarClassNameMap } from "./appbar.const";

@MdUI.outputComponent("mdAppbar")
export class MdAppbar extends OutputComponent {
  main(_: Context, type: D<AppbarType>, inner: D<Content>): void {
    _.$root.addCls(appbarClassNameMap[getD(type)]);

    _.$cls`mdui-appbar mdui-appbar-fixed`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdAppbar: MdAppbar;
  }
}
