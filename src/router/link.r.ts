import { Content, D, OutputComponent, OutputComponentContext, getD, outputComponent } from "../lib";

@outputComponent("rRouterLink")
export class RRouterLink extends OutputComponent {
  main(_: OutputComponentContext<this>, target: D<string>, content: D<Content>): void {
    let href = getD(target);
    // TODO: normalize href
    _.a(target, content);
  }
}

declare module "../../component/index" {
  interface OutputComponents {
    rRouterLink: RRouterLink;
  }
}
