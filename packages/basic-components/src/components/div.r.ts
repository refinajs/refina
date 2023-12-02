import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("div")
export class BasicDiv extends OutputComponent {
  main(_: Context, inner?: D<Content>) {
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    div: BasicDiv;
  }
}
