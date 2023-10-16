import { Content, D, TriggerComponent, TriggerComponentContext, getD, triggerComponent } from "refina";
import { IconName } from "../icon";

@triggerComponent("mdIntrinsicButton")
export class MdIntrinsicButton extends TriggerComponent<void> {
  main(
    _: TriggerComponentContext<void, this>,
    inner: D<Content>,
    accent: D<boolean> = true,
    raised: D<boolean> = true,
    disabled: D<boolean> = false,
    ripple: D<boolean> = true,
    icon: D<boolean> = false,
  ): void {
    _.$cls("mdui-btn");
    getD(ripple) && _.$cls("mdui-ripple");
    getD(raised) && _.$cls("mdui-btn-raised");
    getD(accent) && _.$cls("mdui-color-theme-primary");
    getD(icon) && _.$cls("mdui-btn-icon");
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
    _.mdIntrinsicButton(inner, true, true, getD(disabled), true, false) && _.$fire();
  }
}

@triggerComponent("mdIconButton")
export class MdIconButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, icon: IconName, disabled: D<boolean> = false): void {
    _.mdIntrinsicButton(
      (_) => {
        _.mdIcon(icon);
      },
      true,
      true,
      getD(disabled),
      true,
      true,
    ) && _.$fire();
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdIntrinsicButton: MdIntrinsicButton;
    mdButton: MdButton;
    mdIconButton: MdIconButton;
  }
}
