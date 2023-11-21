import { ComponentContext, Content, D, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdProse")
export class MdProse extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>): void {
    _.$cls`mdui-prose`;
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdProse: MdProse;
  }
}
