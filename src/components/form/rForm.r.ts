import { TriggerComponent, TriggerComponentContext, triggerComponent } from "../../lib";
import { FormContext, IntrinsicFormContext } from "./base";

@(triggerComponent("rForm") as <T>(v: T) => T)
export class RForm<T extends object> extends TriggerComponent {
  data: T;
  submit: () => void;

  main(_: TriggerComponentContext<null, this>, data: T, inner: (context: FormContext<T>) => void): void {
    this.data = data;
    this.submit = _.$fireWith(null);
    _.$cls`f`;
    _.div((_) => {
      const context = new IntrinsicFormContext(_.$view, this);
      inner(context as unknown as FormContext<T>);
    });
  }
}

declare module "../../context" {
  interface CustomContext<C> {
    rForm: RForm<any> extends C ? <T extends object>(data: T, inner: (context: FormContext<T>) => void) => void : never;
  }
}
