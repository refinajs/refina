import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("p")
export class BasicP extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._p({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    p: BasicP;
  }
}
