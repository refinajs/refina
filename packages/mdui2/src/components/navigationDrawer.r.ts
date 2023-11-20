import {
  ComponentContext,
  Content,
  D,
  HTMLElementComponent,
  TriggerComponent,
  bindArgsToContent,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdNavigationDrawer")
export class MdNavigationDrawer extends TriggerComponent<boolean> {
  navDrawerRef = ref<HTMLElementComponent<"mdui-navigation-drawer">>();
  main(
    _: ComponentContext,
    trigger: D<Content<[open: (open?: boolean) => void]>>,
    inner: D<Content<[close: (open?: boolean) => void]>>,
    modal: D<boolean> = false,
    contained: D<boolean> = false,
  ): void {
    const modalOptions = getD(modal) ? { modal: true, "close-on-esc": true, "close-on-overlay-click": true } : {};

    _.embed(
      bindArgsToContent(trigger, (open = true) => {
        this.navDrawerRef.current!.node.open = open;
        _.$update();
      }),
    );
    _.$ref(this.navDrawerRef) &&
      _._mdui_navigation_drawer(
        { ...modalOptions, contained: getD(contained) },
        bindArgsToContent(inner, (open = false) => {
          this.navDrawerRef.current!.node.open = open;
          _.$update();
        }),
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdNavigationDrawer: MdNavigationDrawer;
  }
}
