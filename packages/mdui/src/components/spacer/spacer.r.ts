import { OutputComponent, OutputComponentContext, outputComponent } from "refina";

@outputComponent("mdSpacer")
export class MdSpacer extends OutputComponent {
  main(_: OutputComponentContext<this>): void {
    _.$cls`mdui-toolbar-spacer`;
    _._div();
  }
}

declare module "refina" {
  interface OutputComponents {
    mdSpacer: MdSpacer;
  }
}
