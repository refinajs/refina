import { Content, D, TriggerComponent, TriggerComponentContext, triggerComponent } from "refina";

@triggerComponent("mdButton")
export class MdButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>): void {
    _.$cls`mdui-btn`;
    _._button(
      {
        onclick: _.$fireWith(),
      },
      inner,
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdButton: MdButton;
  }
}
