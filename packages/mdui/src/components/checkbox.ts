import { Content, HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

export type CheckboxState = boolean | undefined;

declare module "refina" {
  interface Components {
    mdCheckbox(
      state: Model<CheckboxState>,
      label?: Content,
      disabled?: boolean,
    ): this is {
      $ev: CheckboxState;
    };
  }
}
MdUI.triggerComponents.mdCheckbox = function (_) {
  const checkboxRef = ref<HTMLElementComponent<"mdui-checkbox">>();
  return (state, label, disabled = false) => {
    const stateValue = valueOf(state);
    const checked = stateValue;
    const indeterminate = stateValue === undefined;

    _.$ref(checkboxRef) &&
      _._mdui_checkbox(
        {
          checked,
          indeterminate,
          disabled,
          onchange: () => {
            const node = checkboxRef.current!.node;
            const newState = node.indeterminate ? undefined : node.checked;
            _.$updateModel(state, newState);
            this.$fire(newState);
          },
        },
        label,
      );
  };
};
