import {
  Content,
  HTMLElementComponent,
  Model,
  bySelf,
  ref,
  valueOf,
} from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdRadioGroup<Value extends string>(
      selected: Model<Value>,
      options: readonly Value[],
      disabled?: boolean | boolean[],
      contentOverride?: Partial<Record<Value, Content>>,
    ): this is {
      $ev: Value;
    };
  }
}
MdUI.triggerComponents.mdRadioGroup = function (_) {
  const radioGroupRef = ref<HTMLElementComponent<"mdui-radio-group">>();
  return (selected, options, disabled = false, contentOverride = {}) => {
    const groupDisabled = disabled === true;
    const optionsDisabled = typeof disabled === "boolean" ? [] : disabled;

    _.$ref(radioGroupRef) &&
      _._mdui_radio_group(
        {
          value: valueOf(selected),
          disabled: groupDisabled,
          onchange: () => {
            const newSelected = radioGroupRef.current!.node.value;
            _.$updateModel(selected, newSelected);
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
  };
};
