import { Select } from "mdui";
import {
  Content,
  Model,
  TriggerComponent,
  _,
  bySelf,
  elementRef,
  unwrap,
} from "refina";

export type MdSelectVariant = Select["variant"];

export class MdSelect<Value extends string> extends TriggerComponent {
  selectRef = elementRef<"mdui-select">();
  varient: MdSelectVariant = "filled";
  $main(
    value: Model<Value>,
    options: readonly Value[],
    disabled: boolean | boolean[] = false,
    contentOverride: Partial<Record<Value, Content>> = {},
  ): this is {
    $ev: Value;
  } {
    const groupDisabled = disabled === true;
    const optionsDisabled = typeof disabled === "boolean" ? [] : disabled;

    _.$ref(this.selectRef);
    _._mdui_select(
      {
        value: unwrap(value),
        disabled: groupDisabled,
        variant: this.varient,
        onchange: () => {
          const newValue = this.selectRef.current!.node.value as Value;
          this.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      },
      _ =>
        _.for(options, bySelf, (value, index) =>
          _._mdui_menu_item(
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

export class MdOutlinedSelect<Value extends string> extends MdSelect<Value> {
  varient = "outlined" as const;
}
