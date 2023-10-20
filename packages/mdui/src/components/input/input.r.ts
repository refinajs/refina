import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI from "../../plugin";
import { UpdateMDUI } from "../../symbol";

@MdUI.triggerComponent("mdInput")
export class MdInput extends TriggerComponent<string> {
  inputEl = ref<HTMLElementComponent<"input">>();
  main(_: ComponentContext<this>, value: D<string>, label: D<string> = "", disabled: D<boolean> = false): void {
    _.$cls`mdui-textfield` && _.$cls`mdui-textfield-floating-label`;
    _._div({}, () => {
      _.$cls`mdui-textfield-label`;
      _._label({}, label);
      _.$cls`mdui-textfield-input`;
      _.$ref(this.inputEl) &&
        _._input({
          type: "text",
          value: getD(value),
          disabled: getD(disabled),
          oninput: () => {
            const newValue = this.inputEl.current!.node.value;
            _.$setD(value, newValue);
            this.$fire(newValue);
          },
        });
    });
    _.$permanentData[UpdateMDUI] = true;
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdInput: MdInput;
  }
}
