import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdTooltip(
      text: string,
      inner: Content,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdTooltip = function (_) {
  return (text, inner) => {
    _._mdui_tooltip(
      {
        content: text,
      },
      inner,
      {
        open: this.$fireWith(true),
        close: this.$fireWith(false),
      },
    );
  };
};
