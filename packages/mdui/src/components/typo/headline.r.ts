import { Context, D, OutputComponent, getD } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdHeadline")
export class MdHeadline extends OutputComponent {
  main(_: Context, inner: D<string>, opacity: D<boolean> = false): void {
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
