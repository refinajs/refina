import { Context, D, OutputComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdCircularProgress")
export class MdCircularProgress extends OutputComponent {
  main(_: Context, percentage?: D<number | undefined>): void {
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
