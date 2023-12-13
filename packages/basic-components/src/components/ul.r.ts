import { D, LoopKey } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    ul<T>(
      data: D<Iterable<T>>,
      key: LoopKey<T>,
      itemView: (item: T, index: number) => void,
    ): void;
  }
}

Basics.outputComponents.ul = function (_) {
  return (data, key, itemView) => {
    _._ul({}, _ =>
      _.for(data, key, (item, index) => {
        itemView(item, index);
      }),
    );
  };
};
