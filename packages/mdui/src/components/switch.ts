import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdSwitch(
      checked: Model<boolean>,
      disabled?: boolean,
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
        checked: valueOf(checked),
        disabled,
        onchange: () => {
          const newState = switchRef.current!.node.checked;
          _.$updateModel(checked, newState);
          this.$fire(newState);
        },
      });
  };
};
