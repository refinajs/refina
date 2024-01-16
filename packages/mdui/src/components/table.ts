import { Content, LoopKey, byIndex } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdTable<T>(
      data: Iterable<T>,
      head: Content[] | Content,
      key: LoopKey<T>,
      row: (item: T, index: number) => void,
    ): void;
  }
}
MdUI.outputComponents.mdTable = function (_) {
  return <T>(
    data: Iterable<T>,
    head: Content[] | Content,
    key: LoopKey<T>,
    row: (item: T, index: number) => void,
  ) => {
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
  };
};

declare module "refina" {
  interface Components {
    mdTableHeader(inner: Content): void;
  }
}
MdUI.outputComponents.mdTableHeader = function (_) {
  return inner => {
    _._th({}, inner);
  };
};

declare module "refina" {
  interface Components {
    mdTableCell(inner: Content): void;
  }
}
MdUI.outputComponents.mdTableCell = function (_) {
  return inner => {
    _._td({}, inner);
  };
};
