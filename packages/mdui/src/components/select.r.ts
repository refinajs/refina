import { Select } from "mdui";
import {
  Content,
  D,
  DPartialRecord,
  DReadonlyArray,
  HTMLElementComponent,
  bySelf,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

export type SelectVariant = Select["variant"];

declare module "refina" {
  interface Components {
    mdSelect<Value extends string>(
      value: D<Value>,
      options: DReadonlyArray<Value>,
      disabled?: D<boolean> | DReadonlyArray<boolean>,
      contentOverride?: DPartialRecord<Value, Content>,
      varient?: SelectVariant,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdSelect = function (_) {
  const selectRef = ref<HTMLElementComponent<"mdui-select">>();
  return <Value extends string>(
    value: D<Value>,
    options: DReadonlyArray<Value>,
    disabled: D<boolean> | DReadonlyArray<boolean> = false,
    contentOverride: DPartialRecord<Value, Content> = {},
    varient: SelectVariant = "filled",
  ) => {
    const contentOverrideValue = getD(contentOverride);
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled =
      typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _.$ref(selectRef) &&
      _._mdui_select(
        {
          value: getD(value),
          disabled: groupDisabled,
          variant: varient,
          onchange: () => {
            const newValue = selectRef.current!.node.value as Value;
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
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedSelect<Value extends string>(
      value: D<Value>,
      options: DReadonlyArray<Value>,
      disabled?: D<boolean> | DReadonlyArray<boolean>,
      contentOverride?: DPartialRecord<Value, Content>,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdOutlinedSelect = function (_) {
  return <Value extends string>(
    value: D<Value>,
    options: DReadonlyArray<Value>,
    disabled: D<boolean> | DReadonlyArray<boolean> = false,
    contentOverride: DPartialRecord<Value, Content> = {},
  ) => {
    _.mdSelect(value, options, disabled, contentOverride, "outlined");
  };
};
