import { OutputComponent, Context, D, Content } from "refina";
import Basics from "../plugin";

@Basics.outputComponent("h1")
export class BasicH1 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h1({}, inner);
  }
}

@Basics.outputComponent("h2")
export class BasicH2 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h2({}, inner);
  }
}

@Basics.outputComponent("h3")
export class BasicH3 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h3({}, inner);
  }
}

@Basics.outputComponent("h4")
export class BasicH4 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h4({}, inner);
  }
}

@Basics.outputComponent("h5")
export class BasicH5 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h5({}, inner);
  }
}

@Basics.outputComponent("h6")
export class BasicH6 extends OutputComponent {
  main(_: Context, inner: D<Content>) {
    _._h6({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    h1: BasicH1;
    h2: BasicH2;
    h3: BasicH3;
    h4: BasicH4;
    h5: BasicH5;
    h6: BasicH6;
  }
}
