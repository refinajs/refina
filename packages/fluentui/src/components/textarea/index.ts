import {
  HTMLElementComponent,
  Model,
  TriggerComponent,
  _,
  ref,
  unwrap,
} from "refina";
import useStyles from "./styles";
import { FTextareaAppearance, FTextareaResize } from "./types";

export class FTextarea extends TriggerComponent {
  inputRef = ref<HTMLElementComponent<"textarea">>();
  $main(
    value: Model<string>,
    disabled = false,
    placeholder = "",
    resize: FTextareaResize = "none",
    appearance: FTextareaAppearance = "outline",
  ): this is {
    $ev: string;
  } {
    const styles = useStyles(
      disabled,
      appearance.startsWith("filled"),
      false,
      appearance,
      resize,
    );

    styles.root();
    _._span({}, _ => {
      styles.textarea();
      _.$ref(this.inputRef);
      _._textarea({
        value: unwrap(value),
        disabled: disabled,
        placeholder,
        oninput: () => {
          const newVal = this.inputRef.current!.node.value;
          this.$updateModel(value, newVal);
          this.$fire(newVal);
        },
      });
    });
    return this.$fired;
  }
}

export * from "./types";
