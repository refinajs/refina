import { ComponentContext, D, DOMElementComponent, TriggerComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles, { sliderCSSVars } from "./fSlider.styles";

function getPercent(value: number, min: number, max: number) {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

@FluentUI.triggerComponent("fSlider")
export class FSlider extends TriggerComponent<number> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(
    _: ComponentContext,
    value: D<number>,
    disabled: D<boolean> = false,
    min: D<number> = 0,
    max: D<number> = 100,
    step?: D<number | undefined>,
  ): void {
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
          ? `${sliderCSSVars.sliderStepsPercentVar}: ${(stepValue * 100) / (maxValue - minValue)}%;`
          : ""
      }
      ${sliderCSSVars.sliderProgressVar}: ${getPercent(valueValue, minValue, maxValue)}%;`;
    _._div({}, _ => {
      const onChange = () => {
        const newValue = clamp(Number(this.inputRef.current!.node.value), minValue, maxValue);
        _.$setD(value, newValue);
        this.$fire(newValue);
      };
      styles.input(disabledValue)(_);
      _.$ref(this.inputRef) &&
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
  }
}

declare module "refina" {
  interface TriggerComponents {
    fSlider: FSlider;
  }
}
