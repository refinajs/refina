import {
  Content,
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

export type CheckboxState = boolean | undefined;

@MdUI.triggerComponent("mdCheckbox")
export class MdCheckbox extends TriggerComponent<CheckboxState> {
  checkboxRef = ref<HTMLElementComponent<"mdui-checkbox">>();
  main(
    _: Context,
    state: D<CheckboxState>,
    label?: D<Content>,
    disabled: D<boolean> = false,
  ): void {
    const stateValue = getD(state);
    const checked = stateValue;
    const indeterminate = stateValue === undefined;

    _.$ref(this.checkboxRef) &&
      _._mdui_checkbox(
        {
          checked,
          indeterminate,
          disabled: getD(disabled),
          onchange: () => {
            const node = this.checkboxRef.current!.node;
            const newState = node.indeterminate ? undefined : node.checked;
            _.$setD(state, newState);
            this.$fire(newState);
          },
        },
        label,
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdCheckbox: MdCheckbox;
  }
}