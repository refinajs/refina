import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdLayoutMain(inner: Content): void;
  }
}
MdUI.outputComponents.mdLayoutMain = function (_) {
  return inner => {
    _._mdui_layout_main({}, inner);
  };
};
