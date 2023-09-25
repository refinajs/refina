import { Content, D, TriggerComponent, TriggerComponentContext, byIndex, getD, triggerComponent } from "refina";

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
    _.$cls`bg-[#e3e3e3] relative rounded m-3`;
    _.div(() => {
      _.$cls`px-5 py-2 text-xl bg-gray-400 rounded-t`;
      _.div(heading);
      _.$cls`p-4 text-sm`;
      _.div(body);
      if (buttonsValue.length > 0) {
        _.$cls`flex items-center h-10`;
        _.div(() => {
          _.for(buttons, byIndex, (btn, index) => {
            _.$cls`px-2 h-full flex-initial w-64 rounded bg-gray-300 hover:bg-gray-400 transition-colors`;
            _.button(btn, disabledValue[index]) && _.$fire(index);
          });
        });
      }
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    rCard: RCard;
  }
}
