import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdLayout(inner: Content): void;
  }
}
MdUI.outputComponents.mdLayout = function (_) {
  return inner => {
    _._mdui_layout({}, inner);
  };
};
