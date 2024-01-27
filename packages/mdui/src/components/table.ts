import { Component, Content, LoopKey, _, byIndex } from "refina";

export class MdTable extends Component {
  $main<T>(
    data: Iterable<T>,
    head: Content[] | Content,
    key: LoopKey<T>,
    row: (item: T, index: number) => void,
  ): void {
    _.$cls`mdui-table`;
    _._div({}, _ => {
      _._table({}, _ => {
        _._thead({}, _ => {
          if (Array.isArray(head)) {
            _.for(head, byIndex, item => {
              _._th({}, item);
            });
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
    });
  }
}

export class MdTableHeader extends Component {
  $main(children: Content): void {
    _._th({}, children);
  }
}

export class MdTableCell extends Component {
  $main(children: Content): void {
    _._td({}, children);
  }
}
