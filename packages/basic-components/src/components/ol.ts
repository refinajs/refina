import { LoopKey } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    ol<T>(
      data: Iterable<T>,
      key: LoopKey<T>,
      itemView: (item: T, index: number) => void,
    ): void;
  }
}

Basics.outputComponents.ol = function (_) {
  return (data, key, itemView) => {
    _._ol({}, _ =>
      _.for(data, key, (item, index) => {
        itemView(item, index);
      }),
    );
  };
};
