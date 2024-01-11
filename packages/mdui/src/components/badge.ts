import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdBadge(inner?: Content | undefined): void;
  }
}
MdUI.outputComponents.mdBadge = function (_) {
  return inner => {
    if (inner === undefined) {
      _._mdui_badge({
        variant: "small",
      });
    } else {
      _._mdui_badge(
        {
          variant: "large",
        },
        inner,
      );
    }
  };
};
