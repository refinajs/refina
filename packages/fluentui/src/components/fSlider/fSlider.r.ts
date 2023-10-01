import { D, DOMElementComponent, TriggerComponent, TriggerComponentContext, getD, ref, triggerComponent } from "refina";
import styles, { sliderCSSVars } from "./fSlider.styles";

function getPercent(value: number, min: number, max: number) {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

@triggerComponent("fSlider")
export class FSlider extends TriggerComponent<number> {
  inputEl = ref<DOMElementComponent<"input">>();
  main(
    _: TriggerComponentContext<number, this>,
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
    _._div({}, () => {
      const onChange = () => {
        const newValue = clamp(Number(this.inputEl.current!.node.value), minValue, maxValue);
        _.$setD(value, newValue);
        _.$fire(newValue);
      };
      styles.input(disabledValue)(_);
      _.$ref(this.inputEl) &&
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
