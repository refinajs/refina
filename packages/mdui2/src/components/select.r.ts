import { Select } from "mdui";
import {
  Content,
  Context,
  D,
  DPartialRecord,
  DReadonlyArray,
  HTMLElementComponent,
  TriggerComponent,
  TriggerComponentFuncAssertThisType,
  bySelf,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

export type SelectVariant = Select["variant"];

@MdUI2.triggerComponent("mdSelect")
export class MdSelect<Value extends string> extends TriggerComponent<Value> {
  varient: SelectVariant = "filled";

  selectRef = ref<HTMLElementComponent<"mdui-select">>();
  main(
    _: Context,
    value: D<Value>,
    options: DReadonlyArray<Value>,
    disabled: D<boolean> | DReadonlyArray<boolean> = false,
    contentOverride: DPartialRecord<Value, Content> = {},
  ): void {
    const contentOverrideValue = getD(contentOverride);
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled =
      typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _.$ref(this.selectRef) &&
      _._mdui_select(
        {
          value: getD(value),
          disabled: groupDisabled,
          variant: this.varient,
          onchange: () => {
            const newValue = this.selectRef.current!.node.value as Value;
            _.$setD(value, newValue);
            this.$fire(newValue);
          },
        },
        _ =>
          _.for(options, bySelf, (value, index) =>
            _._mdui_menu_item(
              {
                value: getD(value),
                disabled: optionsDisabled[index],
              },
              contentOverrideValue[value] ?? value,
            ),
          ),
      );
  }
}

@MdUI2.triggerComponent("mdOutlinedSelect")
export class MdOutlinedSelect<Value extends string> extends MdSelect<Value> {
  varient: SelectVariant = "outlined";
}

declare module "refina" {
  interface ContextFuncs<C> {
    mdSelect: MdSelect<any> extends C["enabled"]
      ? <Value extends string>(
          value: D<Value>,
          options: DReadonlyArray<Value>,
          disabled?: D<boolean> | DReadonlyArray<boolean>,
          contentOverride?: DPartialRecord<Value, Content>,
        ) => // @ts-ignore
        this is TriggerComponentFuncAssertThisType<Value>
      : never;
    mdOutlinedSelect: MdOutlinedSelect<any> extends C["enabled"]
      ? <Value extends string>(
          value: D<Value>,
          options: DReadonlyArray<Value>,
          disabled?: D<boolean> | DReadonlyArray<boolean>,
          contentOverride?: DPartialRecord<Value, Content>,
        ) => // @ts-ignore
        this is TriggerComponentFuncAssertThisType<Value>
      : never;
  }
}
