import { ComponentContext, Content, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdCheckbox")
export class MdCheckbox extends TriggerComponent<boolean> {
  checkboxRef = ref<HTMLElementComponent<"mdui-checkbox">>();
  main(_: ComponentContext, checked: D<boolean>, label?: D<Content>, disabled: D<boolean> = false): void {
    _.$ref(this.checkboxRef) &&
      _._mdui_checkbox(
        {
          checked: getD(checked),
          disabled: getD(disabled),
          onchange: () => {
            const newState = this.checkboxRef.current!.node.checked;
            _.$setD(checked, newState);
            this.$fire(newState);
          },
        },
        label,
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdCheckbox: MdCheckbox;
  }
}
