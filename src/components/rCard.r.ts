import { TriggerComponent, TriggerComponentContext, Content, D, triggerComponent, getD, byIndex } from "../lib";

@triggerComponent("rCard")
export class RCard extends TriggerComponent<number> {
  main(
    _: TriggerComponentContext<number, this>,
    heading: D<Content>,
    body: D<Content>,
    buttons: D<D<Content>[]> = [],
    disabled: D<D<boolean>[]> = [],
  ) {
    const buttonsValue = getD(buttons);
    const disabledValue = getD(disabled);
    _.$cls`bg-[#e3e3e3] relative rounded`;
    _.div(() => {
      _.$cls`pt-4 px-6 pb-[10px] text-xl`;
      _.div(heading);
      _.$cls`p-4 text-sm`;
      _.div(body);
      if (buttonsValue.length > 0) {
        _.$cls`p-2 flex items-center min-h-[52px]`;
        _.div(() => {
          _.for(buttons, byIndex, (btn, index) => {
            _.$cls`px-2 h-9 me-2`;
            _.rButton("btn", disabledValue[index]) && _.$fire(index);
          });
        });
      }
    });
  }
}

declare module "../component/index" {
  interface TriggerComponents {
    rCard: RCard;
  }
}
