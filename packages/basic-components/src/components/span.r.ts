import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("span")
export class BasicSpan extends OutputComponent {
  main(_: Context, inner?: D<Content>) {
    _._span({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    span: BasicSpan;
  }
}
