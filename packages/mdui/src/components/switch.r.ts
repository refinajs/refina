import {
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

@MdUI.triggerComponent("mdSwitch")
export class MdSwitch extends TriggerComponent<boolean> {
  switchRef = ref<HTMLElementComponent<"mdui-switch">>();
  main(_: Context, checked: D<boolean>, disabled: D<boolean> = false): void {
    _.$ref(this.switchRef) &&
      _._mdui_switch({
        checked: getD(checked),
        disabled: getD(disabled),
        onchange: () => {
          const newState = this.switchRef.current!.node.checked;
          _.$setD(checked, newState);
          this.$fire(newState);
        },
      });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdSwitch: MdSwitch;
  }
}