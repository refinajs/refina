import { Content, D, HTMLElementComponent, getD, ref } from "../../lib";
import { FormComponent, FormComponentContext, Validator, formComponent } from "./base";

@formComponent("rCheckbox")
export class RCheckbox<T extends object> extends FormComponent<boolean, T> {
  activited = false;
  inputEl = ref<HTMLElementComponent<"input">>();
  main(
    _: FormComponentContext<boolean, T, this>,
    label: D<Content>,
    validator: Validator<boolean, T> = () => true,
  ): void {
    _.$data ??= false;
    const valid = validator(_.$data, _.$form);
    _.$cls`relative h-10 flex  items-center`;
    _.div(() => {
      _.$cls``;
      _.$ref(this.inputEl) &&
        _._input({
          type: "checkbox",
          checked: _.$data,
          oninput: () => {
            this.activited = true;
            _.$data = this.inputEl.current!.node.checked;
            _.$refresh();
          },
        });
      _.$cls`inline-block ml-3 ${this.activited && valid !== true ? "text-red-500" : ""}`;
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
    rCheckbox: RCheckbox<any>;
  }
}
