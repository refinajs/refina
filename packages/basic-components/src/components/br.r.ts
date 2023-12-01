import { Context, OutputComponent } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("br")
export class BasicBr extends OutputComponent {
  main(_: Context) {
    _._br();
  }
}

declare module "refina" {
  interface OutputComponents {
    br: BasicBr;
  }
}
