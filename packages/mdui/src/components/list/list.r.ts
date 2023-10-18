import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdList")
export class MdList extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-list`;
    _._div({}, inner);
  }
}

@MdUI.outputComponent("mdListItem")
export class MdListItem extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-list-item`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdList: MdList;
    mdListItem: MdListItem;
  }
}
