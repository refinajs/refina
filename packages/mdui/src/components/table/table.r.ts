import { ComponentContext, Content, D, KeyFunc, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdTable")
export class MdTable extends OutputComponent {
  main<T>(
    _: ComponentContext<this>,
    head: D<Content>,
    data: D<Iterable<T>>,
    key: KeyFunc<T>,
    row: (item: T, index: number) => void,
  ): void {
    _.$cls`mdui-table-fluid`;
    _._div({}, _ => {
      _.$cls`mdui-table`;
      _._table({}, _ => {
        _._thead({}, head);
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

@MdUI.outputComponent("mdTableCell")
export class MdTableCell extends OutputComponent {
  main(_: ComponentContext<this>, content: D<Content>): void {
    _._td({}, content);
  }
}

declare module "refina" {
  interface CustomContext<C> {
    mdTable: MdTable extends C
      ? <T>(head: D<Content>, data: D<Iterable<T>>, key: KeyFunc<T>, row: (item: T, index: number) => void) => void
      : never;
  }
  interface OutputComponents {
    mdTableCell: MdTableCell;
  }
}
