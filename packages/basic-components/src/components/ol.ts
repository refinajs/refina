import { Component, LoopKey, _ } from "refina";

export class BasicOl extends Component {
  $main<T>(
    data: Iterable<T>,
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
