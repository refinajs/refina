import { Content, D, OutputComponent, OutputComponentContext, outputComponent } from "../lib";

@outputComponent("rLeftNav")
export class RLeftNav extends OutputComponent {
  main(_: OutputComponentContext<this>, nav: D<Content>, body: Content): void {
    _.$cls`fixed left-0 top-0 bottom-0 w-20 bg-gray-100`;
    _.div(nav);
    _.$cls`fixed left-20 top-0 bottom-0 right-0`;
    _.div(body);
  }
}

declare module "../component/index" {
  interface OutputComponents {
    rLeftNav: RLeftNav;
  }
}
