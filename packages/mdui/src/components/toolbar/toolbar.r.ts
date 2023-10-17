import { Content, D, OutputComponent, OutputComponentContext } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdToolbar")
export class MdToolbar extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-toolbar`;
    _.$cls`mdui-color-theme`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdToolbar: MdToolbar;
  }
}
