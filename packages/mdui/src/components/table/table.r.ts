import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdTable")
export class MdTable extends OutputComponent {
  main(_: ComponentContext<this>, head: D<Content>, body: D<Content>): void {
    _.$cls`mdui-table-fluid`;
    _._div({}, (_) => {
      _.$cls`mdui-table`;
      _._table({}, (_) => {
        _._thead({}, head);
        _._tbody({}, body);
      });
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdTable: MdTable;
  }
}
