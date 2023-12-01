import { OutputComponent, Context, D, Content, getD } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("a")
export class BaiscA extends OutputComponent {
  main(_: Context, href: D<string>, inner: D<Content>) {
    _._a(
      {
        href: getD(href),
      },
      inner,
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    a: BaiscA;
  }
}
