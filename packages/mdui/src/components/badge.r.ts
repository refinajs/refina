import { Content, D, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdBadge(inner?: D<Content | undefined>): void;
  }
}
MdUI.outputComponents.mdBadge = function (_) {
  return inner => {
    const innerValue = getD(inner);
    if (innerValue === undefined) {
      _._mdui_badge({
        variant: "small",
      });
    } else {
      _._mdui_badge(
        {
          variant: "large",
        },
        innerValue,
      );
    }
  };
};
