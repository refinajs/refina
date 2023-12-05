import { Context, D, OutputComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdLinearProgress")
export class MdLinearProgress extends OutputComponent {
  main(_: Context, percentage?: D<number | undefined>): void {
    _._mdui_linear_progress({
      value: getD(percentage),
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdLinearProgress: MdLinearProgress;
  }
}
