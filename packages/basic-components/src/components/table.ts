import { Content, LoopKey, byIndex } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    table<T>(
      data: Iterable<T>,
      head: Content[] | Content,
      key: LoopKey<T>,
      row: (item: T, index: number) => void,
    ): void;
    th(inner: Content): void;
    td(inner: Content): void;
  }
}

Basics.outputComponents.table = function (_) {
  return (data, head, key, row) => {
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
