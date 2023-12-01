import { TriggerComponent, Context, D, Content, getD } from "refina";
import Basics from "../plugin";

@Basics.triggerComponent("button")
export class BasicButton extends TriggerComponent<MouseEvent> {
  main(_: Context, inner: D<Content>, disabled: D<boolean> = false) {
    _._button(
      {
        onclick: ev => {
          this.$fire(ev);
        },
        disabled: getD(disabled),
        type: "button",
      },
      getD(inner),
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    button: BasicButton;
  }
}
