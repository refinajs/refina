import { Content, D, DArray, LoopKey, byIndex, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdTable<T>(
      data: D<Iterable<T>>,
      head: DArray<Content> | D<Content>,
      key: LoopKey<T>,
      row: (item: T, index: number) => void,
    ): void;
  }
}
MdUI.outputComponents.mdTable = function (_) {
  return <T>(
    data: D<Iterable<T>>,
    head: DArray<Content> | D<Content>,
    key: LoopKey<T>,
    row: (item: T, index: number) => void,
  ) => {
    _.$cls`mdui-table`;
    _._div({}, _ => {
      _._table({}, _ => {
        _._thead({}, _ => {
          const headValue = getD(head);
          if (Array.isArray(headValue)) {
            _.for(headValue, byIndex, item => {
              _._th({}, item);
            });
          } else {
            _.embed(headValue);
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
    mdTableHeader(inner: D<Content>): void;
  }
}
MdUI.outputComponents.mdTableHeader = function (_) {
  return inner => {
    _._th({}, inner);
  };
};

declare module "refina" {
  interface Components {
    mdTableCell(inner: D<Content>): void;
  }
}
MdUI.outputComponents.mdTableCell = function (_) {
  return inner => {
    _._td({}, inner);
  };
};
