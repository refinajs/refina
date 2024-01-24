import { Component, LoopKey, _ } from "refina";

export class MdList extends Component {
  $main<T>(
    data: Iterable<T>,
    key: LoopKey<T>,
    body: (item: T, index: number) => void,
  ): void {
    _._mdui_list({}, _ =>
      _.for(data, key, (item, index) =>
        _._mdui_list_item({}, _ => {
          body(item, index);
        }),
      ),
    );
  }
}
