import {
  Context,
  D,
  DOMElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import Basics from "../plugin";

@Basics.triggerComponent("textInput")
export class BasicTextInput extends TriggerComponent<string> {
  type = "text";

  inputRef = ref<DOMElementComponent<"input">>();
  main(
    _: Context,
    value: D<string>,
    disabled?: D<boolean>,
    placeholder?: D<string>,
  ) {
    _.$ref(this.inputRef) &&
      _._input({
        type: this.type,
        disabled: getD(disabled),
        placeholder: getD(placeholder),
        value: getD(value),
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

@Basics.triggerComponent("passwordInput")
export class BasicPasswordInput extends BasicTextInput {
  type = "password";
}

@Basics.triggerComponent("checkbox")
export class BasicCheckbox extends TriggerComponent<boolean> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(_: Context, checked: D<boolean>) {
    _.$ref(this.inputRef) &&
      _._input({
        type: "checkbox",
        checked: getD(checked),
        onchange: () => {
          const newChecked = this.inputRef.current!.node.checked;
          _.$setD(checked, newChecked);
          this.$fire(newChecked);
        },
      });
  }
}

declare module "refina" {
  interface TriggerComponents {
    textInput: BasicTextInput;
    passwordInput: BasicPasswordInput;
    checkbox: BasicCheckbox;
  }
}
