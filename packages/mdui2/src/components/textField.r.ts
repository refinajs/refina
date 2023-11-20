import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdTextField")
export class MdTextField extends TriggerComponent<string> {
  inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  main(_: ComponentContext, value: D<string>, label?: D<string>, disabled: D<boolean> = false): void {
    _.$ref(this.inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdTextField: MdTextField;
  }
}
