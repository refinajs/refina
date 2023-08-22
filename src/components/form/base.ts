import { IntrinsicContext, ToFullContext } from "../../context";
import {
  Component,
  ComponentConstructor,
  Content,
  D,
  IntrinsicComponentContext,
  getD,
} from "../../lib";
import { View } from "../../view";
import { RForm } from "./rForm.r";

export class IntrinsicFormContext<
  T extends object,
  C,
> extends IntrinsicContext<C> {
  constructor(
    $view: View,
    public $form: RForm<T>,
  ) {
    super($view);
  }

  $$(funcName: string, ckey: string, ...args: any[]): any {
    if (funcName in formContextFuncs) {
      return formContextFuncs[funcName].call(
        this as unknown as FormContext<any, any>,
        ckey,
        ...args,
      );
    }
    return super.$$(funcName, ckey, ...args);
  }
}

export type FormComponentFuncArgs<S extends FormComponent<any, any>> =
  S extends {
    main(_: any, ...args: infer A): void;
  }
    ? A
    : never;

export type FormComponentValueType<S extends FormComponent<any, any>> =
  S extends FormComponent<infer V, any> ? V : never;

type ExtractSatisfiedIndex<O extends object, V> = {
  [K in keyof O]: O[K] extends V ? K : never;
}[keyof O];

export type FormContext<T extends object, C = any> = ToFullContext<
  C,
  IntrinsicFormContext<T, C>
> & {
  [K in keyof FormComponents]: FormComponents[K] extends C
    ? (
        index: D<
          ExtractSatisfiedIndex<T, FormComponentValueType<FormComponents[K]>>
        >,
        ...args: FormComponentFuncArgs<FormComponents[K]>
      ) => void
    : never;
};

export const formContextFuncs = {} as Record<
  keyof FormComponents,
  (this: FormContext<any, any>, ckey: string, ...args: any[]) => void
>;

export interface FormComponents
  extends Record<string, FormComponent<any, any>> {}

export function formComponent<N extends keyof FormComponents>(name: N) {
  return (ctor: ComponentConstructor<FormComponents[N]>) => {
    formContextFuncs[name] = function (
      this: FormContext<any, any>,
      ckey,
      index,
      ...args
    ) {
      const component = this.beginComponent(ckey, ctor);
      const context = new IntrinsicFormComponentContext(this, component, index);
      component.main(
        context as unknown as FormComponentContext<any, any, FormComponents[N]>,
        ...args,
      );
      this.endComponent(ckey);
    };
    return ctor;
  };
}

export abstract class FormComponent<V, T extends object> extends Component {
  abstract main(_: FormComponentContext<V, T, this>, ...args: any[]): void;
}

export class IntrinsicFormComponentContext<
  V,
  T extends object,
  S extends FormComponent<V, T>,
  C,
> extends IntrinsicComponentContext<S, C> {
  constructor(
    public $caller: FormContext<T>,
    $component: S,
    public $index: D<ExtractSatisfiedIndex<T, V>>,
  ) {
    super($caller, $component);
  }

  get $form() {
    return this.$caller.$form;
  }

  get $data(): V {
    return this.$form.data[getD(this.$index)];
  }
  set $data(value: V) {
    //@ts-ignore
    this.$form.data[getD(this.$index)] = value;
  }

  $submit() {
    this.$form.submit();
  }
}

export type FormComponentContext<
  V,
  T extends object,
  S extends FormComponent<any, T> = FormComponent<any, T>,
  C = any,
> = ToFullContext<C, IntrinsicFormComponentContext<V, T, S, C>>;

export type Validator<V, T extends object> = (
  value: V,
  form: RForm<T>,
) => true | D<Content>;
