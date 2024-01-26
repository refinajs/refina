import {
  Content,
  Model,
  TriggerComponent,
  _,
  bySelf,
  elementRef,
  unwrap,
} from "refina";

export class MdRadioGroup<Value extends string> extends TriggerComponent {
  radioGroupRef = elementRef<"mdui-radio-group">();
  $main(
    selected: Model<Value>,
    options: readonly Value[],
    disabled: boolean | boolean[] = false,
    contentOverride: Partial<Record<Value, Content>> = {},
  ): this is {
    $ev: Value;
  } {
    const groupDisabled = disabled === true;
    const optionsDisabled = typeof disabled === "boolean" ? [] : disabled;

    _.$ref(this.radioGroupRef);
    _._mdui_radio_group(
      {
        value: unwrap(selected),
        disabled: groupDisabled,
        onchange: () => {
          const newSelected = this.radioGroupRef.current!.node.value as Value;
          this.$updateModel(selected, newSelected);
          this.$fire(newSelected);
        },
      },
      _ =>
        _.for(options, bySelf, (value, index) =>
          _._mdui_radio(
            {
              value,
              disabled: optionsDisabled[index],
            },
            contentOverride[value] ?? value,
          ),
        ),
    );
    return this.$fired;
  }
}
