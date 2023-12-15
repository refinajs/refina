import { D, HTMLElementComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./fTextarea.styles";
import { FTextareaAppearance, FTextareaResize } from "./fTextarea.types";

declare module "refina" {
  interface Components {
    fTextarea(
      value?: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
      resize?: D<FTextareaResize>,
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
    const disabledValue = getD(disabled),
      resizeValue = getD(resize);

    styles.root(
      disabledValue,
      appearance.startsWith("filled"),
      false,
      appearance,
    )(_);
    _._span({}, _ => {
      styles.textarea(disabledValue, resizeValue)(_);
      _.$ref(inputRef) &&
        _._textarea({
          value: getD(value),
          disabled: disabledValue,
          placeholder: getD(placeholder),
          oninput: () => {
            const newVal = inputRef.current!.node.value;
            _.$setD(value, newVal);
            this.$fire(newVal);
          },
        });
    });
  };
};
