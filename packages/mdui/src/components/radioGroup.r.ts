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
import MdUI from "../plugin";

@MdUI.triggerComponent("mdRadioGroup")
export class MdRadioGroup<
  Value extends string,
> extends TriggerComponent<Value> {
  radioGroupRef = ref<HTMLElementComponent<"mdui-radio-group">>();
  main(
    _: Context,
    selected: D<Value>,
    options: DReadonlyArray<Value>,
    disabled: D<boolean> | DReadonlyArray<boolean> = false,
    contentOverride: DPartialRecord<Value, Content> = {},
  ): void {
    const contentOverrideValue = getD(contentOverride);
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled =
      typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _.$ref(this.radioGroupRef) &&
      _._mdui_radio_group(
        {
          value: getD(selected),
          disabled: groupDisabled,
          onchange: () => {
            const newSelected = this.radioGroupRef.current!.node.value as Value;
            _.$setD(selected, newSelected);
            this.$fire(newSelected);
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
          selected: D<Value>,
          options: DReadonlyArray<Value>,
          disabled?: D<boolean> | DReadonlyArray<boolean>,
          contentOverride?: DPartialRecord<Value, Content>,
        ) => // @ts-ignore
        this is TriggerComponentFuncAssertThisType<Value>
      : never;
  }
}
