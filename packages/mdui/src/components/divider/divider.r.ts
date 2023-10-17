import { Content, D, OutputComponent, OutputComponentContext, getD, outputComponent } from "refina";

@outputComponent("mdDivider")
export class MdDivider extends OutputComponent {
  main(_: OutputComponentContext<this>): void {
    _.$cls`mdui-divider`;
    _._div();
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDivider: MdDivider;
  }
}
