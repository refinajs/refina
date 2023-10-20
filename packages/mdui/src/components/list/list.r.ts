import { ComponentContext, Content, D, OutputComponent, TriggerComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdList")
export class MdList extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-list`;
    _._div({}, inner);
  }
}

@MdUI.triggerComponent("mdListItem")
export class MdListItem extends TriggerComponent<void> {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-list-item`;
    _._div(
      {
        onclick: () => {
          this.$fire();
        },
      },
      inner,
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    mdList: MdList;
  }
  interface TriggerComponents {
    mdListItem: MdListItem;
  }
}
