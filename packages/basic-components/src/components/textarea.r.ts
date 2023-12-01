import {
  Context,
  D,
  DOMElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import Basics from "../plugin";

@Basics.triggerComponent("textarea")
export class BasicTextarea extends TriggerComponent<string> {
  inputRef = ref<DOMElementComponent<"textarea">>();
  main(
    _: Context,
    value: D<string>,
    disabled?: D<boolean>,
    placeholder?: D<string>,
  ) {
    _.$ref(this.inputRef) &&
      _._textarea({
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

declare module "refina" {
  interface TriggerComponents {
    textarea: BasicTextarea;
  }
}
