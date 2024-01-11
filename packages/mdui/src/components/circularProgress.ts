import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdCircularProgress(percentage?: number | undefined): void;
  }
}
MdUI.outputComponents.mdCircularProgress = function (_) {
  return percentage => {
    _._mdui_circular_progress({
      value: percentage,
    });
  };
};
