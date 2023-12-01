import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("label")
export class BasicLabel extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._label({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    label: BasicLabel;
  }
}
