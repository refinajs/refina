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

declare module "refina" {
  interface Components {
    mdRadioGroup<Value extends string>(
      selected: D<Value>,
      options: DReadonlyArray<Value>,
      disabled?: D<boolean> | DReadonlyArray<boolean>,
      contentOverride?: DPartialRecord<Value, Content>,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdRadioGroup = function (_) {
  const radioGroupRef = ref<HTMLElementComponent<"mdui-radio-group">>();
  return (selected, options, disabled = false, contentOverride = {}) => {
    const contentOverrideValue = getD(contentOverride);
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled =
      typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _.$ref(radioGroupRef) &&
      _._mdui_radio_group(
        {
          value: getD(selected),
          disabled: groupDisabled,
          onchange: () => {
            const newSelected = radioGroupRef.current!.node.value;
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
  };
};
