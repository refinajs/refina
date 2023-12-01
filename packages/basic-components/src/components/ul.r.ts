import { OutputComponent, Context, D, LoopKey } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("ul")
export class BasicUl extends OutputComponent {
  main<T>(
    _: Context,
    data: D<Iterable<T>>,
    key: LoopKey<T>,
    itemView: (item: T, index: number) => void,
  ): void {
    _._ul({}, _ =>
      _.for(data, key, (item, index) => {
        itemView(item, index);
      }),
    );
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    ul: BasicUl extends C["enabled"]
      ? <T>(
          data: D<Iterable<T>>,
          key: LoopKey<T>,
          itemView: (item: T, index: number) => void,
        ) => void
      : never;
  }
}
