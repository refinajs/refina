import {
  Content,
  D,
  TriggerComponent,
  TriggerComponentContext,
  TriggerComponentFuncAssertThisType,
  triggerComponent,
} from "../../lib";
import { FormComponent, FormContext, IntrinsicFormContext } from "./base";

@(triggerComponent("rForm") as <T>(v: T) => T)
export class RForm<T extends object> extends TriggerComponent<T> {
  defaultData: T;
  data: T;

  inputs = new Set<FormComponent<any, T>>();

  main(
    _: TriggerComponentContext<T, this>,
    data: T,
    inner: (context: FormContext<T>) => void,
    submitButton: D<Content> | null = null,
  ): void {
    this.defaultData ??= { ...data };
    this.data = data;
    _.$cls``;
    _.div(() => {
      const context = new IntrinsicFormContext(_.$view, this);
      inner(context as unknown as FormContext<T>);

      if (submitButton !== null) {
        _.$cls`mt-4`;
        _._button(
          {
            type: "button",
            onclick: () => {
              if (!this.checkValid()) return;
              _.$fire(this.data);
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
    this.view.update();
  }

  deactivateAll() {
    for (const input of this.inputs) {
      input.activited = false;
    }
    this.view.update();
  }

  checkValid() {
    this.activateAll();
    for (const input of this.inputs) {
      if (input.valid !== true) {
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
    rForm: RForm<any> extends C
      ? <T extends object>(
          data: T,
          inner: (context: FormContext<T>) => void,
          submitButton?: D<Content> | null,
        ) => this is TriggerComponentFuncAssertThisType<T, RForm<T>>
      : never;
  }
}
