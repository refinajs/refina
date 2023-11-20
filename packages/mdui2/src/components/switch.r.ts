import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdSwitch")
export class MdSwitch extends TriggerComponent<boolean> {
  switchRef = ref<HTMLElementComponent<"mdui-switch">>();
  main(_: ComponentContext, checked: D<boolean>, disabled: D<boolean> = false): void {
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
