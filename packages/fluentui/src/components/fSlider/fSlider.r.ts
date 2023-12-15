import { D, DOMElementComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles, { sliderCSSVars } from "./fSlider.styles";

function getPercent(value: number, min: number, max: number) {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

declare module "refina" {
  interface Components {
    fSlider(
      value: D<number>,
      disabled?: D<boolean>,
      min?: D<number>,
      max?: D<number>,
      step?: D<number | undefined>,
    ): this is {
      $ev: number;
    };
  }
}
FluentUI.triggerComponents.fSlider = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (value, disabled = false, min = 0, max = 100, step) => {
    const valueValue = getD(value),
      disabledValue = getD(disabled),
      minValue = getD(min),
      maxValue = getD(max),
      stepValue = getD(step);
    styles.root(disabledValue)(_);
    _.$css`
      ${sliderCSSVars.sliderDirectionVar}: 90deg;
      ${
        stepValue && stepValue > 0
          ? `${sliderCSSVars.sliderStepsPercentVar}: ${
              (stepValue * 100) / (maxValue - minValue)
            }%;`
          : ""
      }
      ${sliderCSSVars.sliderProgressVar}: ${getPercent(
        valueValue,
        minValue,
        maxValue,
      )}%;`;
    _._div({}, _ => {
      const onChange = () => {
        const newValue = clamp(
          Number(inputRef.current!.node.value),
          minValue,
          maxValue,
        );
        _.$setD(value, newValue);
        this.$fire(newValue);
      };
      styles.input(disabledValue)(_);
      _.$ref(inputRef) &&
        _._input({
          type: "range",
          disabled: disabledValue,
          min: String(minValue),
          max: String(maxValue),
          step: String(stepValue),
          value: String(clamp(valueValue, minValue, maxValue)),
          onchange: onChange,
          oninput: onChange,
        });

      styles.rail(_);
      _._div();

      styles.thumb(disabledValue)(_);
      _._div();
    });
  };
};
