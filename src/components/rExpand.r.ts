import { Content, D, OutputComponent, OutputComponentContext, outputComponent } from "../lib";

@outputComponent("rExpand")
export class RExpand extends OutputComponent {
  open = false;
  main(_: OutputComponentContext<this, any>, heading: D<Content>, content: D<Content>): void {
    _.$cls`border border-black rounded `;
    _.div(() => {
      if (
        _.$cls`text-lg w-full text-start` &&
        _.button(() => {
          _.$cls`inline-block m-2`;
          _.$css`${this.open ? "transform:rotate(90deg)" : ""}`;
          _.span(">");

          _.$cls`inline-block`;
          _.div(heading);
        })
      ) {
        this.open = !this.open;
      }

      if (this.open) {
        _.$cls`p-2 border-t w-full border-gray-400`;
        _.div(content);
      }
    });
  }
}

declare module "../component/index" {
  interface OutputComponents {
    rExpand: RExpand;
  }
}
