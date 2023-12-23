import { Content, D, DArray, LoopKey, byIndex, getD } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    table<T>(
      data: D<Iterable<T>>,
      head: DArray<Content> | D<Content>,
      key: LoopKey<T>,
      row: (item: T, index: number) => void,
    ): void;
    th(inner: D<Content>): void;
    td(inner: D<Content>): void;
  }
}

Basics.outputComponents.table = function (_) {
  return (data, head, key, row) => {
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

Basics.outputComponents.th = function (_) {
  return content => {
    _._th({}, content);
  };
};

Basics.outputComponents.td = function (_) {
  return content => {
    _._td({}, content);
  };
};
