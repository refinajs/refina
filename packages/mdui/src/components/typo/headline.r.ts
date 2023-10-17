import { D, OutputComponent, ComponentContext, getD } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdHeadline")
export class MdHeadline extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<string>, opacity: D<boolean> = false): void {
    if (getD(opacity)) {
      _.$cls`mdui-typo-headline-opacity`;
    } else {
      _.$cls`mdui-typo-headline`;
    }
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdHeadline: MdHeadline;
  }
}
