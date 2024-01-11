import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdSlider(
      value: Model<number>,
      disabled?: boolean,
      step?: number,
      min?: number,
      max?: number,
    ): this is {
      $ev: number;
    };
  }
}
MdUI.triggerComponents.mdSlider = function (_) {
  const sliderRef = ref<HTMLElementComponent<"mdui-slider">>();
  return (value, disabled = false, step = 1, min = 0, max = 100) => {
    _.$ref(sliderRef) &&
      _._mdui_slider({
        value: valueOf(value),
        disabled,
        min,
        max,
        step,
        oninput: () => {
          const newValue = sliderRef.current!.node.value;
          _.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};
