import { Component, Content, LoopKey, _, byIndex } from "refina";

export class BasicTable extends Component {
  $main<T>(
    data: Iterable<T>,
    head: Content[] | Content,
    key: LoopKey<T>,
    row: (item: T, index: number) => void,
  ): void {
    _._table({}, _ => {
      _._thead({}, _ => {
        if (Array.isArray(head)) {
          _._tr({}, _ =>
            _.for(head, byIndex, item => {
              _._th({}, item);
            }),
          );
        } else {
          _.embed(head);
        }
      });
      _._tbody({}, _ => {
        _.for(data, key, (item, index) => {
          _._tr({}, _ => {
            row(item, index);
          });
        });
      });
    });
  }
}

export class BasicTh extends Component {
  $main(children: Content): void {
    _._th({}, children);
  }
}

export class BasicTd extends Component {
  $main(children: Content): void {
    _._td({}, children);
  }
}
