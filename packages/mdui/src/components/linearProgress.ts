import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdLinearProgress(percentage?: number | undefined): void;
  }
}
MdUI.outputComponents.mdLinearProgress = function (_) {
  return percentage => {
    _._mdui_linear_progress({
      value: percentage,
    });
  };
};
