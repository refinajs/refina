import { Content, D, TriggerComponent, TriggerComponentContext, triggerComponent } from "../../lib";
import { FormComponent, FormContext, IntrinsicFormContext } from "./base";

@(triggerComponent("rForm") as <T>(v: T) => T)
export class RForm<T extends object> extends TriggerComponent {
  defaultData: T;
  data: T;

  inputs = new Set<FormComponent<any, T>>();

  main(
    _: TriggerComponentContext<null, this>,
    data: T,
    inner: (context: FormContext<T>) => void,
    submitButton: D<Content> | null = null,
  ): void {
    this.defaultData ??= { ...data };
    this.data = data;
    _.$cls``;
    _.div((_) => {
      const context = new IntrinsicFormContext(_.$view, this);
      inner(context as unknown as FormContext<T>);

      if (submitButton !== null) {
        _.$cls`mt-4`;
        _._button(
          {
            type: "button",
            onclick: () => {
              if (!this.checkValid()) return;
              _.$fire(null);
            },
          },
          submitButton,
        );
      }
    });
  }

  activateAll() {
    for (const input of this.inputs) {
      input.activited = true;
    }
  }

  deactivateAll() {
    for (const input of this.inputs) {
      input.activited = false;
    }
  }

  checkValid() {
    this.activateAll();
    for (const input of this.inputs) {
      if (!input.valid) {
        return false;
      }
    }
    return true;
  }

  reset() {
    for (const key in this.data) {
      this.data[key] = this.defaultData[key];
    }
    this.deactivateAll();
  }
}

declare module "../../context" {
  interface CustomContext<C> {
    rForm: RForm<any> extends C ? <T extends object>(data: T, inner: (context: FormContext<T>) => void) => void : never;
  }
}
