import { D, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdLinearProgress(percentage?: D<number | undefined>): void;
  }
}
MdUI.outputComponents.mdLinearProgress = function (_) {
  return percentage => {
    _._mdui_linear_progress({
      value: getD(percentage),
    });
  };
};
