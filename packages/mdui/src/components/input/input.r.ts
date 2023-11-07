import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI from "../../plugin";
import { needUpdateTextFields } from "../../update";

@MdUI.triggerComponent("mdInput")
export class MdInput extends TriggerComponent<string> {
  inputRef = ref<HTMLElementComponent<"input">>();
  main(_: ComponentContext<this>, value: D<string>, label: D<string> = "", disabled: D<boolean> = false): void {
    _.$cls`mdui-textfield` && _.$cls`mdui-textfield-floating-label`;
    _._div({}, _ => {
      _.$cls`mdui-textfield-label`;
      _._label({}, label);
      _.$cls`mdui-textfield-input`;
      _.$ref(this.inputRef) &&
        _._input({
          type: "text",
          value: getD(value),
          disabled: getD(disabled),
          oninput: e => {
            // Workaround to ignore event triggered by mdui
            if (!e.isTrusted) return;

            const newValue = this.inputRef.current!.node.value;
            _.$setD(value, newValue);
            needUpdateTextFields();
            this.$fire(newValue);
          },
        });
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdInput: MdInput;
  }
}
