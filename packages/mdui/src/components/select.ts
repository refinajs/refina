import { Select } from "mdui";
import {
  Content,
  HTMLElementComponent,
  Model,
  bySelf,
  ref,
  valueOf,
} from "refina";
import MdUI from "../plugin";

export type SelectVariant = Select["variant"];

declare module "refina" {
  interface Components {
    mdSelect<Value extends string>(
      value: Model<Value>,
      options: readonly Value[],
      disabled?: boolean | boolean[],
      contentOverride?: Partial<Record<Value, Content>>,
      varient?: SelectVariant,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdSelect = function (_) {
  const selectRef = ref<HTMLElementComponent<"mdui-select">>();
  return <Value extends string>(
    value: Model<Value>,
    options: Value[],
    disabled: boolean | boolean[] = false,
    contentOverride: Partial<Record<Value, Content>> = {},
    varient: SelectVariant = "filled",
  ) => {
    const groupDisabled = disabled === true;
    const optionsDisabled = typeof disabled === "boolean" ? [] : disabled;

    _.$ref(selectRef) &&
      _._mdui_select(
        {
          value: valueOf(value),
          disabled: groupDisabled,
          variant: varient,
          onchange: () => {
            const newValue = selectRef.current!.node.value as Value;
            _.$updateModel(value, newValue);
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
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedSelect<Value extends string>(
      value: Model<Value>,
      options: readonly Value[],
      disabled?: boolean | readonly boolean[],
      contentOverride?: Partial<Record<Value, Content>>,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdOutlinedSelect = function (_) {
  return <Value extends string>(
    value: Model<Value>,
    options: Value[],
    disabled: boolean | boolean[] = false,
    contentOverride: Partial<Record<Value, Content>> = {},
  ) => {
    _.mdSelect(value, options, disabled, contentOverride, "outlined") &&
      this.$fire(_.$ev);
  };
};
