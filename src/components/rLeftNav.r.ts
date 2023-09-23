import type { MaterialIcon } from "material-icons";
import {
  Content,
  D,
  OutputComponent,
  OutputComponentContext,
  TriggerComponent,
  TriggerComponentContext,
  View,
  getD,
  outputComponent,
  triggerComponent,
} from "../lib";

@outputComponent("rLeftNav")
export class RLeftNav extends OutputComponent {
  main(_: OutputComponentContext<this>, nav: D<Content>, body: Content): void {
    _.$cls`fixed left-0 top-0 bottom-0 w-20 hover:w-52 z-10
      transition-all duration-300 ease-in-out overflow-hidden`;
    _.div(() => {
      _.$cls`absolute w-full h-full bg-gray-100 blur-xl`;
      _._div();
      _.$cls`absolute w-full h-full`;
      _.div(nav);
    });
    _.$cls`fixed left-20 top-0 bottom-0 right-0`;
    _.div(body);
  }
}

@triggerComponent("rNavLogo")
export class RNavLogo extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>): void {
    _.$cls`block text-2xl font-bold text-center text-center w-full pt-1 pb-4 overflow-hidden`;
    _.div(() => _.$cls`` && _.button(inner) && _.$fire());
  }
}

@triggerComponent("rNavItem")
export class RNavItem extends TriggerComponent<void> {
  main(
    _: TriggerComponentContext<void, this>,
    icon: D<View | MaterialIcon>,
    inner: D<Content>,
    disabled: D<boolean> = false,
  ): void {
    _.$cls`w-full grid grid-cols-[5rem_8rem] overflow-hidden h-10 hover:bg-slate-400`;
    if (
      _.button(() => {
        const iconValue = getD(icon);
        if (typeof iconValue === "string") {
          _.mdIcon(iconValue);
        } else {
          _.span(iconValue);
        }
        _.$cls`text-left`;
        _.div(inner);
      }, disabled)
    ) {
      _.$fire();
    }
  }
}

declare module "../component/index" {
  interface OutputComponents {
    rLeftNav: RLeftNav;
  }
  interface TriggerComponents {
    rNavLogo: RNavLogo;
    rNavItem: RNavItem;
  }
}
