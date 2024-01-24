import { Component, LoopKey, _ } from "refina";

export class BasicUl extends Component {
  $main<T>(
    data: Iterable<T>,
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
