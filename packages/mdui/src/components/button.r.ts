import { Content, D, TriggerComponent, TriggerComponentContext, getD, triggerComponent } from "refina";

@triggerComponent("mdIntrinsicButton")
export class MdIntrinsicButton extends TriggerComponent<void> {
  main(
    _: TriggerComponentContext<void, this>,
    inner: D<Content>,
    accent: D<boolean> = true,
    raised: D<boolean> = true,
    disabled: D<boolean> = false,
    ripple: D<boolean> = true,
  ): void {
    _.$cls("mdui-btn");
    getD(ripple) && _.$cls("mdui-ripple");
    getD(raised) && _.$cls("mdui-btn-raised");
    getD(accent) && _.$cls("mdui-color-theme-accent");
    _._button(
      {
        type: "button",
        disabled: getD(disabled),
        onclick: _.$fireWith(),
      },
      inner,
    );
  }
}

@triggerComponent("mdButton")
export class MdButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.mdIntrinsicButton(inner, true, true, getD(disabled), false) && _.$fire();
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdIntrinsicButton: MdIntrinsicButton;
    mdButton: MdButton;
  }
}
