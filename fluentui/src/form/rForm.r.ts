import {
  Content,
  D,
  TriggerComponent,
  TriggerComponentContext,
  TriggerComponentFuncAssertThisType,
  triggerComponent,
} from "refina";
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
      const context = new IntrinsicFormContext(_.$app, this);
      inner(context as unknown as FormContext<T>);

      submitButton !== null && _.$cls`mt-4` && _.rButton(submitButton) && this.checkValid() && _.$fire(this.data.$data);
    });
  }

  activateAll() {
    for (const input of this.inputs) {
      this.data[`$${input}`].activited = true;
    }
    this.app.update();
  }

  deactivateAll() {
    for (const input of this.inputs) {
      this.data[`$${input}`].activited = false;
    }
    this.app.update();
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

declare module "refina" {
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
