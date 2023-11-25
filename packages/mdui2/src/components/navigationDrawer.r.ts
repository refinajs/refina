import {
  ComponentContext,
  Content,
  D,
  TriggerComponent,
  bindArgsToContent,
  getD,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdControlledNavDrawer")
export class MdControlledNavDrawer extends TriggerComponent<
  boolean,
  {
    contained: boolean;
  }
> {
  main(
    _: ComponentContext,
    open: D<boolean>,
    inner: D<Content>,
    modal: D<boolean> = false,
  ): void {
    const modalOptions = getD(modal)
      ? { modal: true, "close-on-esc": true, "close-on-overlay-click": true }
      : {};
    _._mdui_navigation_drawer(
      { ...modalOptions, open: getD(open), contained: this.$props.contained },
      inner,
    );
  }
}

@MdUI2.triggerComponent("mdNavDrawer")
export class MdNavDrawer extends TriggerComponent<
  boolean,
  {
    contained: boolean;
  }
> {
  open = false;
  main(
    _: ComponentContext,
    trigger: D<Content<[open: (open?: boolean) => void]>>,
    inner: D<Content<[close: (open?: boolean) => void]>>,
    modal: D<boolean> = false,
  ): void {
    _.embed(
      bindArgsToContent(trigger, (open = true) => {
        this.open = open;
        _.$update();
      }),
    );
    _.mdControlledNavDrawer(
      this.open,
      bindArgsToContent(inner, (open = false) => {
        this.open = open;
        _.$update();
      }),
      modal,
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdControlledNavDrawer: MdControlledNavDrawer;
    mdNavDrawer: MdNavDrawer;
  }
}
