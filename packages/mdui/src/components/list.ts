import { LoopKey } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdList<T>(
      data: Iterable<T>,
      key: LoopKey<T>,
      body: (item: T, index: number) => void,
    ): void;
  }
}
MdUI.outputComponents.mdList = function (_) {
  return (data, key, body) => {
    _._mdui_list({}, _ =>
      _.for(data, key, (item, index) =>
        _._mdui_list_item({}, _ => {
          body(item, index);
        }),
      ),
    );
  };
};
