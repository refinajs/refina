import { Model, TriggerComponent, _, elementRef, unwrap } from "refina";

export class BasicTextarea extends TriggerComponent {
  inputRef = elementRef<"textarea">();
  $main(
    value: Model<string>,
    disabled?: boolean,
    placeholder?: string,
  ): this is {
    $ev: string;
  } {
    _.$ref(this.inputRef);
    _._textarea({
      disabled,
      placeholder,
      value: unwrap(value),
      oninput: () => {
        const newValue = this.inputRef.current!.node.value;
        this.$updateModel(value, newValue);
        this.$fire(newValue);
      },
    });
    return this.$fired;
  }
}
