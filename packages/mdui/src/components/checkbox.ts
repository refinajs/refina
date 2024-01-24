import {
  Content,
  Model,
  TriggerComponent,
  _,
  elementRef,
  valueOf,
} from "refina";

export type MdCheckboxState = boolean | undefined;

export class MdCheckbox extends TriggerComponent {
  checkboxRef = elementRef<"mdui-checkbox">();
  $main(
    state: Model<MdCheckboxState>,
    label?: Content,
    disabled = false,
  ): this is {
    $ev: MdCheckboxState;
  } {
    const stateValue = valueOf(state);
    const checked = stateValue;
    const indeterminate = stateValue === undefined;

    _.$ref(this.checkboxRef);
    _._mdui_checkbox(
      {
        checked,
        indeterminate,
        disabled,
        onchange: () => {
          const node = this.checkboxRef.current!.node;
          const newState = node.indeterminate ? undefined : node.checked;
          this.$updateModel(state, newState);
          this.$fire(newState);
        },
      },
      label,
    );
    return this.$fired;
  }
}
