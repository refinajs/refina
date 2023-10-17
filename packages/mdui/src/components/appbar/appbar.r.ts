import { Content, D, OutputComponent, OutputComponentContext, getD, outputComponent } from "refina";
import { AppbarContent } from "./appbar.const";

@outputComponent("mdAppbar")
export class MdAppbar extends OutputComponent {
  main(_: OutputComponentContext<this>, content: D<AppbarContent>, inner: D<Content>): void {
    _.$cls`mdui-appbar`;
    _.$cls`mdui-appbar-fixed`;
    _._div({}, inner);
    if (getD(content) === "toolbar") {
      _.$root.addClasses(["mdui-appbar-with-toolbar"]);
    } else if (getD(content) === "tab") {
      _.$root.addClasses(["mdui-appbar-with-tab"]);
    } else if (getD(content) === "both") {
      _.$root.addClasses(["mdui-appbar-with-tab-larger"]);
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
