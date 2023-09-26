import { HTMLElementComponent, ref } from "refina";
import { FormComponent, FormComponentContext, formComponent } from "./base";

@formComponent("rCheckbox")
export class RCheckbox<T extends object> extends FormComponent<boolean, T> {
  defaultValue = false;
  inputEl = ref<HTMLElementComponent<"input">>();
  main(_: FormComponentContext<boolean, T, this>): void {
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
            _.$update();
          },
        });
      _.$cls`inline-block ml-3 ${this.valid !== true ? "text-red-500" : ""}`;
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
    rCheckbox: RCheckbox<any>;
  }
}
