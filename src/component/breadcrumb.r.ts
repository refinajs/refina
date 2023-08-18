import {
  D,
  TriggerComponent,
  TriggerComponentContext,
  byIndex,
  getD,
  triggerComponent,
} from "../lib";

@triggerComponent("breadcrumb")
export class Breadcrumb extends TriggerComponent {
  main(_: TriggerComponentContext<number, this>, items: D<string[]>) {
    let itemsValue = getD(items);
    _._div({}, () => {
      _.for(itemsValue.slice(0, -1), byIndex, (item, i) => {
        _._span(
          {
            onclick: _.$fireWith(i),
          },
          item,
        );
        _._span({}, " / ");
      });
      _._span({}, itemsValue.at(-1)!);
    });
    return false;
  }
}
declare module "./index" {
  interface TriggerComponents {
    breadcrumb: Breadcrumb;
  }
}
