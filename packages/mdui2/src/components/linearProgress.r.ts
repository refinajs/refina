import { ComponentContext, D, OutputComponent, getD } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdLinearProgress")
export class MdLinearProgress extends OutputComponent {
  main(_: ComponentContext, percentage?: D<number | undefined>): void {
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
