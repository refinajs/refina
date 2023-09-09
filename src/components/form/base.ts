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

export type RFormData = Record<string, any>;

export type RFormDataType<T extends RFormData> = {
  $data: T;
  $json: string;
  $form: RForm<T>;
} & {
  [K in keyof Pick<T, string> as `$${K}`]: FormComponent<T[K], T>;
};

export class IntrinsicFormContext<
  T extends RFormData,
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

type ExtractSatisfiedIndex<O extends RFormData, V> = {
  [K in keyof O]: O[K] extends V ? K : never;
}[keyof O];

export type FormContext<T extends RFormData, C = any> = ToFullContext<
  C,
  IntrinsicFormContext<T, C>
> & {
  [K in keyof FormComponents]: FormComponents[K] extends C
    ? (
        index: D<
          ExtractSatisfiedIndex<T, FormComponentValueType<FormComponents[K]>>
        >,
        label?: D<Content>,
        validator?: Validator<FormComponentValueType<FormComponents[K]>, T>,
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
      label,
      validator,
      ...args
    ) {
      const component = this.beginComponent(ckey, ctor);

      this.$form.data[`$${index}`] = component;
      this.$form.inputs.add(index);

      component.form = this.$form;
      component.index = getD(index);

      component.label = label ?? `${index}`;
      component.validator = validator ?? (() => true);

      component.data ??= component.defaultValue;

      const context = new IntrinsicFormComponentContext(this, component);
      component.main(
        context as unknown as FormComponentContext<any, any, FormComponents[N]>,
        ...args,
      );
      this.endComponent(ckey);
    };
    return ctor;
  };
}

export abstract class FormComponent<V, T extends RFormData> extends Component {
  activited = false;

  form: RForm<T>;
  index: ExtractSatisfiedIndex<T, V>;

  get data() {
    return this.form.data.$data[getD(this.index)];
  }
  set data(value: V) {
    this.tempInvalid = false;
    this.form.data.$data[getD(this.index)] = value as any;
  }

  label: D<Content>;
  validator: Validator<V, T>;

  tempInvalid = false as string | false;

  get valid() {
    if (this.tempInvalid) return this.tempInvalid;
    return !this.activited || this.validator(this.data, this.form);
  }

  abstract defaultValue: V;

  abstract main(_: FormComponentContext<V, T, this>, ...args: any[]): void;
}

export class IntrinsicFormComponentContext<
  V,
  T extends RFormData,
  S extends FormComponent<V, T>,
  C,
> extends IntrinsicComponentContext<S, C> {
  constructor(
    public $caller: FormContext<T>,
    $component: S,
  ) {
    super($caller, $component);
  }

  get $form() {
    return this.$caller.$form;
  }

  get $data(): V {
    return this.$component.data;
  }
  set $data(value: V) {
    this.$component.data = value;
  }
}

export type FormComponentContext<
  V,
  T extends RFormData,
  S extends FormComponent<any, T> = FormComponent<any, T>,
  C = any,
> = ToFullContext<C, IntrinsicFormComponentContext<V, T, S, C>>;

export type Validator<V, T extends RFormData> = (
  value: V,
  form: RForm<T>,
) => true | D<Content>;

export function formData<T extends RFormData>(defaultValue: Partial<T> = {}) {
  return {
    $data: defaultValue,
    get $json() {
      return JSON.stringify(this.$data);
    },
  } as RFormDataType<T>;
}
