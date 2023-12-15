import { D, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdCircularProgress(percentage?: D<number | undefined>): void;
  }
}
MdUI.outputComponents.mdCircularProgress = function (_) {
  return percentage => {
    _._mdui_circular_progress({
      value: getD(percentage),
    });
  };
};
