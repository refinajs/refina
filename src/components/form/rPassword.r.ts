import { HTMLElementComponent, ref } from "../../lib";
import { FormComponent, FormComponentContext, formComponent } from "./base";
import styles from "./styles";

@formComponent("rPassword")
export class RPassword<T extends object> extends FormComponent<string, T> {
  defaultValue = "";
  inputEl = ref<HTMLElementComponent<"input">>();
  focused = false;
  main(_: FormComponentContext<string, T, this>): void {
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
          type: "password",
          value: _.$data,
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
            _.$data = this.inputEl.current!.node.value;
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
    rPassword: RPassword<any>;
  }
}
