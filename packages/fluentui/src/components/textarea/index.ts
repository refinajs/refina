import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";
import { FTextareaAppearance, FTextareaResize } from "./types";

declare module "refina" {
  interface Components {
    fTextarea(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
      resize?: FTextareaResize,
      appearance?: FTextareaAppearance,
    ): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fTextarea = function (_) {
  const inputRef = ref<HTMLElementComponent<"textarea">>();
  return (
    value,
    disabled = false,
    placeholder = "",
    resize = "none",
    appearance = "outline",
  ) => {
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
      _.$ref(inputRef) &&
        _._textarea({
          value: valueOf(value),
          disabled: disabled,
          placeholder,
          oninput: () => {
            const newVal = inputRef.current!.node.value;
            _.$updateModel(value, newVal);
            this.$fire(newVal);
          },
        });
    });
  };
};

export * from "./types";
