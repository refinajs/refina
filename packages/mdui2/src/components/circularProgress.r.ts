import { ComponentContext, OutputComponent, D, getD } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdCircularProgress")
export class MdCircularProgress extends OutputComponent {
  main(_: ComponentContext, percentage?: D<number | undefined>): void {
    _._mdui_circular_progress({
      value: getD(percentage),
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdCircularProgress: MdCircularProgress;
  }
}
