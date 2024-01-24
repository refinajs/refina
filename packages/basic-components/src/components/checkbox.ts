import { Model, TriggerComponent, _, elementRef, valueOf } from "refina";

export class BasicCheckbox extends TriggerComponent {
  inputRef = elementRef<"input">();
  $main(checked: Model<boolean>): this is {
    $ev: boolean;
  } {
    _.$ref(this.inputRef);
    _._input({
      type: "checkbox",
      checked: valueOf(checked),
      onchange: () => {
        const newChecked = this.inputRef.current!.node.checked;
        this.$updateModel(checked, newChecked);
        this.$fire(newChecked);
      },
    });
    return this.$fired;
  }
}
