import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("li")
export class BasicLi extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._li({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    li: BasicLi;
  }
}
