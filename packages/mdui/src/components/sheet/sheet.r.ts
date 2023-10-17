import { OutputComponent, ComponentContext, Content, D } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdSheet")
export class MdSheet extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.$cls`mdui-card`;
    _.$css`padding: 20px;`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdSheet: MdSheet;
  }
}
