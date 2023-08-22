import { Content, D, HTMLElementComponent, getD, ref } from "../../lib";
import { FormComponent, FormComponentContext, Validator, formComponent } from "./base";

@formComponent("rTextField")
export class RTextField<T extends object> extends FormComponent<string, T> {
  activited = false;
  inputEl = ref<HTMLElementComponent<"input">>();
  focused = false;
  main(
    _: FormComponentContext<string, T, this>,
    label: D<Content>,
    validator: Validator<string, T> = () => true,
  ): void {
    _.$data ??= "";
    const valid = validator(_.$data, _.$form);
    _.$cls`relative`;
    _.div(() => {
      _.$cls`border-black border-2 rounded pt-7 pb-1 px-4 text-base`;
      _.$ref(this.inputEl) &&
        _._input({
          type: "text",
          value: _.$data,
          onfocus: () => {
            this.focused = true;
            _.$refresh();
          },
          onblur: () => {
            this.focused = false;
            _.$refresh();
          },
          oninput: () => {
            this.activited = true;
            _.$data = this.inputEl.current!.node.value;
            _.$refresh();
          },
        });
      _.$cls`absolute ${
        this.focused || this.inputEl.current!.node.value.length > 0
          ? "text-sm top-2 start-2"
          : "text-base top-4 start-4 "
      } ${this.activited && valid !== true ? "text-red-500" : ""}`;
      _.div(label);
      if (this.activited && valid !== true) {
        _.$cls`relative text-red-500 text-sm`;
        _.div(valid);
      }
    });
  }
}

declare module "./base" {
  interface FormComponents {
    rTextField: RTextField<any>;
  }
}
