import { Content } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdTopAppBar(inner: Content, append?: Content): void;
  }
}
MdUI.outputComponents.mdTopAppBar = function (_) {
  return (inner, append) => {
    _._mdui_top_app_bar(
      {},
      append
        ? _ => {
            _.embed(inner);

            _.$css`flex-grow: 1`;
            _._div();

            _.embed(append);
          }
        : inner,
    );
  };
};

declare module "refina" {
  interface Components {
    mdTopAppBarTitle(inner: Content): void;
  }
}
MdUI.outputComponents.mdTopAppBarTitle = function (_) {
  return inner => {
    _._mdui_top_app_bar_title({}, inner);
  };
};
