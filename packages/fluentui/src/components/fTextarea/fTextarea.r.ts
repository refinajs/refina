import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import { FTextareaAppearance, FTextareaResize } from ".";
import styles from "./fTextarea.styles";

@FluentUI.triggerComponent("fTextarea")
export class FTextarea extends TriggerComponent<string> {
  appearance: FTextareaAppearance = "outline";
  inputRef = ref<HTMLElementComponent<"textarea">>();

  main(
    _: ComponentContext<this>,
    value: D<string>,
    disabled: D<boolean> = false,
    placeholder: D<string> = "",
    resize: D<FTextareaResize> = "none",
  ): void {
    const disabledValue = getD(disabled),
      resizeValue = getD(resize);

    styles.root(disabledValue, this.appearance.startsWith("filled"), false, this.appearance)(_);
    _._span({}, _ => {
      styles.textarea(disabledValue, resizeValue)(_);
      _.$ref(this.inputRef) &&
        _._textarea({
          value: getD(value),
          disabled: disabledValue,
          placeholder: getD(placeholder),
          oninput: () => {
            const newVal = this.inputRef.current!.node.value;
            _.$setD(value, newVal);
            this.$fire(newVal);
          },
        });
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    fTextarea: FTextarea;
  }
}
