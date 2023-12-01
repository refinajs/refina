import { Context, D, OutputComponent, getD } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("img")
export class BasicImg extends OutputComponent {
  main(_: Context, src: D<string>, alt: D<string> = ""): void {
    _._img({
      src: getD(src),
      alt: getD(alt),
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    img: BasicImg;
  }
}
