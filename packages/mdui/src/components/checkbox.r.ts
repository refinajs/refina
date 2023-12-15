import { Content, D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

export type CheckboxState = boolean | undefined;

declare module "refina" {
  interface Components {
    mdCheckbox(
      state: D<CheckboxState>,
      label?: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: CheckboxState;
    };
  }
}
MdUI.triggerComponents.mdCheckbox = function (_) {
  const checkboxRef = ref<HTMLElementComponent<"mdui-checkbox">>();
  return (state, label, disabled = false) => {
    const stateValue = getD(state);
    const checked = stateValue;
    const indeterminate = stateValue === undefined;

    _.$ref(checkboxRef) &&
      _._mdui_checkbox(
        {
          checked,
          indeterminate,
          disabled: getD(disabled),
          onchange: () => {
            const node = checkboxRef.current!.node;
            const newState = node.indeterminate ? undefined : node.checked;
            _.$setD(state, newState);
            this.$fire(newState);
          },
        },
        label,
      );
  };
};
