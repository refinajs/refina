import { OutputComponent, Context, D, LoopKey } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("ol")
export class BasicOl extends OutputComponent {
  main<T>(
    _: Context,
    data: D<Iterable<T>>,
    key: LoopKey<T>,
    itemView: (item: T, index: number) => void,
  ): void {
    _._ol({}, _ =>
      _.for(data, key, (item, index) => {
        itemView(item, index);
      }),
    );
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    ol: BasicOl extends C["enabled"]
      ? <T>(
          data: D<Iterable<T>>,
          key: LoopKey<T>,
          itemView: (item: T, index: number) => void,
        ) => void
      : never;
  }
}
