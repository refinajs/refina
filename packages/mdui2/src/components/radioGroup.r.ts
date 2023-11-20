import {
  ComponentContext,
  Content,
  D,
  DArray,
  DPartialRecord,
  HTMLElementComponent,
  TriggerComponent,
  TriggerComponentFuncAssertThisType,
  bySelf,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdRadioGroup")
export class MdRadioGroup<Value extends string> extends TriggerComponent<Value> {
  radioGroupRef = ref<HTMLElementComponent<"mdui-radio-group">>();
  main(
    _: ComponentContext,
    value: D<Value>,
    options: DArray<Value>,
    disabled: D<boolean> | DArray<boolean> = false,
    contentOverride: DPartialRecord<Value, Content> = {},
  ): void {
    const contentOverrideValue = getD(contentOverride);
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled = typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _.$ref(this.radioGroupRef) &&
      _._mdui_radio_group(
        {
          value: getD(value),
          disabled: groupDisabled,
          onchange: () => {
            const newValue = this.radioGroupRef.current!.node.value as Value;
            _.$setD(value, newValue);
            this.$fire(newValue);
          },
        },
        _ =>
          _.for(options, bySelf, (value, index) =>
            _._mdui_radio(
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

declare module "refina" {
  interface ContextFuncs<C> {
    mdRadioGroup: MdRadioGroup<any> extends C["enabled"]
      ? <Value extends string>(
          value: D<Value>,
          options: DArray<Value>,
          disabled?: D<boolean> | DArray<boolean>,
          contentOverride?: DPartialRecord<Value, Content>,
        ) => //@ts-ignore
        this is TriggerComponentFuncAssertThisType<Value, MdRadioGroup<Value>>
      : never;
  }
}
