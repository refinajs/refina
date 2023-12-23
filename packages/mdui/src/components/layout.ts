import { Content, D } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdLayout(inner: D<Content>): void;
  }
}
MdUI.outputComponents.mdLayout = function (_) {
  return inner => {
    _._mdui_layout({}, inner);
  };
};
