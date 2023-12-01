import {
  Content,
  Context,
  D,
  DArray,
  LoopKey,
  OutputComponent,
  byIndex,
  getD,
} from "refina";
import Basics from "../plugin";

@Basics.outputComponent("table")
export class BasicTable extends OutputComponent {
  main<T>(
    _: Context,
    data: D<Iterable<T>>,
    head: DArray<Content> | D<Content>,
    key: LoopKey<T>,
    row: (item: T, index: number) => void,
  ): void {
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
  }
}

@Basics.outputComponent("th")
export class BasicTh extends OutputComponent {
  main(_: Context, content: D<Content>): void {
    _._th({}, content);
  }
}

@Basics.outputComponent("td")
export class BasicTd extends OutputComponent {
  main(_: Context, content: D<Content>): void {
    _._td({}, content);
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    table: BasicTable extends C["enabled"]
      ? <T>(
          data: D<Iterable<T>>,
          head: DArray<Content> | D<Content>,
          key: LoopKey<T>,
          row: (item: T, index: number) => void,
        ) => void
      : never;
  }
  interface OutputComponents {
    th: BasicTh;
    td: BasicTd;
  }
}
