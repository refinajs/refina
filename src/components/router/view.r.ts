import { OutputComponent, OutputComponentContext, outputComponent } from "../../lib";
import { globalRouter } from "./base";

@outputComponent("rRouterView")
export class RRouterView extends OutputComponent {
  main(_: OutputComponentContext<this>): void {
    globalRouter!.view = _.$view;

    _.div(globalRouter!.current);
  }
}

declare module "../../component/index" {
  interface OutputComponents {
    rRouterView: RRouterView;
  }
}
