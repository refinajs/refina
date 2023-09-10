import { HTMLElementComponent, ref } from "../../lib";
import { FormComponent, FormComponentContext, formComponent } from "./base";

@formComponent("rNumberInput")
export class RNumberInput<T extends object> extends FormComponent<number, T> {
  defaultValue = NaN;
  inputEl = ref<HTMLElementComponent<"input">>();
  focused = false;
  main(_: FormComponentContext<number, T, this>): void {
    _.$cls`relative`;
    _.div(() => {
      _.$cls`border-black border-2 rounded pt-7 pb-1 px-4 text-base`;
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
      _.$cls`absolute ${
        this.focused || this.inputEl.current!.node.value.length > 0
          ? "text-sm top-2 start-2"
          : "text-base top-4 start-4 "
      } ${this.valid !== true ? "text-red-500" : ""}`;
      _.div(this.label);
      if (this.valid !== true) {
        _.$cls`relative text-red-500 text-sm`;
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
