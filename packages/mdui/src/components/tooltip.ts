import { Content, D, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdTooltip(
      text: D<string>,
      inner: D<Content>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdTooltip = function (_) {
  return (text, inner) => {
    _._mdui_tooltip(
      {
        content: getD(text),
      },
      inner,
      {
        open: this.$fireWith(true),
        close: this.$fireWith(false),
      },
    );
  };
};
