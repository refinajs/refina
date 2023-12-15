import { Content, D } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdProse(inner: D<Content>): void;
  }
}
MdUI.outputComponents.mdProse = function (_) {
  return inner => {
    _.$cls`mdui-prose`;
    _._div({}, inner);
  };
};
