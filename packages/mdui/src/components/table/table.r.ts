import { ComponentContext, Content, D, DArray, KeyFunc, OutputComponent, byIndex, getD } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdTable")
export class MdTable extends OutputComponent {
  main<T>(
    _: ComponentContext<this>,
    data: D<Iterable<T>>,
    head: DArray<Content> | D<Content>,
    key: KeyFunc<T>,
    row: (item: T, index: number) => void,
  ): void {
    _.$cls`mdui-table-fluid`;
    _._div({}, _ => {
      _.$cls`mdui-table`;
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

@MdUI.outputComponent("mdTableHeader")
export class MdTableHeader extends OutputComponent {
  main(_: ComponentContext<this>, content: D<Content>): void {
    _._th({}, content);
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
      ? <T>(
          data: D<Iterable<T>>,
          head: DArray<Content> | D<Content>,
          key: KeyFunc<T>,
          row: (item: T, index: number) => void,
        ) => void
      : never;
  }
  interface OutputComponents {
    mdTableHeader: MdTableHeader;
    mdTableCell: MdTableCell;
  }
}
