import {
  Content,
  D,
  TriggerComponent,
  TriggerComponentContext,
  TriggerComponentFuncAssertThisType,
  triggerComponent,
} from "../../lib";
import { FormContext, IntrinsicFormContext, RFormData, RFormDataType } from "./base";

@triggerComponent("rForm")
export class RForm<T extends RFormData> extends TriggerComponent<T> {
  defaultData: T;
  data: RFormDataType<T>;

  inputs = new Set<string>();

  main(
    _: TriggerComponentContext<T, this>,
    data: RFormDataType<T>,
    inner: (context: FormContext<T>) => void,
    submitButton: D<Content> | null = null,
  ): void {
    this.defaultData ??= { ...data.$data };
    this.data = data;
    data.$form = this;
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
              _.$fire(this.data.$data);
            },
          },
          submitButton,
        );
      }
    });
  }

  activateAll() {
    for (const input of this.inputs) {
      this.data[`$${input}`].activited = true;
    }
    this.view.update();
  }

  deactivateAll() {
    for (const input of this.inputs) {
      this.data[`$${input}`].activited = false;
    }
    this.view.update();
  }

  checkValid() {
    this.activateAll();
    for (const input of this.inputs) {
      if (this.data[`$${input}`].valid !== true) {
        return false;
      }
    }
    return true;
  }

  reset() {
    for (const key in this.data) {
      if (!key.startsWith("$")) {
        //@ts-ignore
        this.data[key] = this.defaultData[key];
      }
    }
    this.deactivateAll();
  }
}

declare module "../../context" {
  interface CustomContext<C> {
    rForm: RForm<any> extends C
      ? <T extends RFormData>(
          data: RFormDataType<T>,
          inner: (context: FormContext<T>) => void,
          submitButton?: D<Content> | null,
        ) => this is TriggerComponentFuncAssertThisType<T, RForm<T>>
      : never;
  }
}
