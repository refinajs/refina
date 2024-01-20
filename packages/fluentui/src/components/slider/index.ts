import { DOMElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import useStyles, { sliderCSSVars } from "./styles";

function getPercent(value: number, min: number, max: number) {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

declare module "refina" {
  interface Components {
    fSlider(
      value: Model<number>,
      disabled?: boolean,
      min?: number,
      max?: number,
      step?: number | undefined,
    ): this is {
      $ev: number;
    };
  }
}
FluentUI.triggerComponents.fSlider = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (value, disabled = false, min = 0, max = 100, step) => {
    const modelValue = valueOf(value);

    const styles = useStyles(disabled);

    styles.root();
    _.$css`
      ${sliderCSSVars.sliderDirectionVar}: 90deg;
      ${
        step && step > 0
          ? `${sliderCSSVars.sliderStepsPercentVar}: ${
              (step * 100) / (max - min)
            }%;`
          : ""
      }
      ${sliderCSSVars.sliderProgressVar}: ${getPercent(
        modelValue,
        min,
        max,
      )}%;`;
    _._div({}, _ => {
      const onChange = () => {
        const newValue = clamp(Number(inputRef.current!.node.value), min, max);
        _.$updateModel(value, newValue);
        this.$fire(newValue);
      };
      styles.input();
      _.$ref(inputRef) &&
        _._input({
          type: "range",
          disabled: disabled,
          min: String(min),
          max: String(max),
          step: String(step),
          value: String(clamp(modelValue, min, max)),
          onchange: onChange,
          oninput: onChange,
        });

      styles.rail();
      _._div();

      styles.thumb();
      _._div();
    });
  };
};
