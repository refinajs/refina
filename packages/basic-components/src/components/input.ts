import { Model, TriggerComponent, _, elementRef, unwrap } from "refina";

export class BasicInput extends TriggerComponent {
  inputRef = elementRef<"input">();
  type = "text";
  $main(
    value: Model<string>,
    disabled?: boolean,
    placeholder?: string,
  ): this is {
    $ev: string;
  } {
    _.$ref(this.inputRef);
    _._input({
      type: this.type,
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

export class BasicTextInput extends BasicInput {
  type = "text";
}

export class BasicPasswordInput extends BasicInput {
  type = "password";
}
