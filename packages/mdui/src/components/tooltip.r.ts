import { Content, Context, D, TriggerComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.triggerComponent("mdTooltip")
export class MdTooltip extends TriggerComponent<boolean> {
  main(_: Context, text: D<string>, inner: D<Content>): void {
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
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdTooltip: MdTooltip;
  }
}
