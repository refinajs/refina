import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdBottomAppBar(inner: Content): void;
  }
}
MdUI.outputComponents.mdBottomAppBar = function (_) {
  return inner => {
    _._mdui_bottom_app_bar({}, inner);
  };
};
