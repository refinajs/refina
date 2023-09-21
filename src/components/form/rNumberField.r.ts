import { HTMLElementComponent, ref } from "../../lib";
import { FormComponent, FormComponentContext, formComponent } from "./base";
import styles from "./styles";

@formComponent("rNumberInput")
export class RNumberInput<T extends object> extends FormComponent<number, T> {
  defaultValue = NaN;
  inputEl = ref<HTMLElementComponent<"input">>();
  focused = false;
  main(_: FormComponentContext<number, T, this>): void {
    styles.container(_);
    _.div(() => {
      styles.label(
        this.focused || (this.inputEl.current !== null && this.inputEl.current.node.value.length > 0),
        this.valid !== true,
      )(_);
      _.div(this.label);
      styles.inputEl(_);
      _.$ref(this.inputEl) &&
        _._input({
          type: "number",
          value: Number.isNaN(_.$data) ? "" : `${_.$data}`,
          onfocus: () => {
            this.focused = true;
            _.$update();
          },
          onblur: () => {
            this.focused = false;
            _.$update();
          },
          oninput: () => {
            this.activited = true;
            _.$data = parseFloat(this.inputEl.current!.node.value);
            _.$update();
          },
        });
      if (this.valid !== true) {
        styles.invalidMsg(_);
        _.div(this.valid);
      }
    });
  }
}

declare module "./base" {
  interface FormComponents {
    rNumberInput: RNumberInput<any>;
  }
}
