import { D, OutputComponent, OutputComponentContext } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdTitle")
export class MdTitle extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<string>): void {
    _.$cls`mdui-typo-title`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdTitle: MdTitle;
  }
}
