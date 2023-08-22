import { Content } from "../dom";
import { D, TriggerComponent, TriggerComponentContext, triggerComponent } from "../lib";
// import { rAppendIconSymbol, rPrependIconSymbol } from "./rIcon.r";

@triggerComponent("rButton")
export class RButton extends TriggerComponent {
  main(_: TriggerComponentContext<MouseEvent, this>, inner: D<Content>, disabled: D<boolean> = false) {
    _.$cls`rounded disabled:opacity-50`;
    if (_.button(inner, disabled)) {
      _.$fire(_.$ev);
    }
    // _._button(
    //   {
    //     onclick: _.$fire,
    //     disabled: getD(disabled),
    //   },
    //   () => {
    //     _.$runIfProvided(rPrependIconSymbol, ({ name, stacked }) => {
    //       _.$cls`${stacked ? "block" : "inline"}`;
    //       _.rIcon(name);
    //     });
    //     _.span(inner);
    //     _.$runIfProvided(rAppendIconSymbol, ({ name, stacked }) => {
    //       _.rIcon(name);
    //     });
    //   },
    // );
  }
}

declare module "../component/index" {
  interface TriggerComponents {
    rButton: RButton;
  }
}
