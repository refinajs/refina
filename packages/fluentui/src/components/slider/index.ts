import { Model, TriggerComponent, _, elementRef, unwrap } from "refina";
import useStyles, { sliderCSSVars } from "./styles";

function getPercent(value: number, min: number, max: number) {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

namespace todo {
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
export class FSlider extends TriggerComponent {
  inputRef = elementRef<"input">();
  $main(
    value: Model<number>,
    disabled = false,
    min = 0,
    max = 100,
    step?: number,
  ): this is {
    $ev: number;
  } {
    const modelValue = unwrap(value);

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
        const newValue = clamp(
          Number(this.inputRef.current!.node.value),
          min,
          max,
        );
        this.$updateModel(value, newValue);
        this.$fire(newValue);
      };
      styles.input();
      _.$ref(this.inputRef) &&
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
    return this.$fired;
  }
}
