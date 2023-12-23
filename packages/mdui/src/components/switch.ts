import { D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdSwitch(
      checked: D<boolean>,
      disabled?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdSwitch = function (_) {
  const switchRef = ref<HTMLElementComponent<"mdui-switch">>();
  return (checked, disabled = false) => {
    _.$ref(switchRef) &&
      _._mdui_switch({
        checked: getD(checked),
        disabled: getD(disabled),
        onchange: () => {
          const newState = switchRef.current!.node.checked;
          _.$setD(checked, newState);
          this.$fire(newState);
        },
      });
  };
};
