import {
  D,
  byIndex,
  getD,
  triggerComponent,
  TriggerComponent,
  TriggerComponentContext,
} from "../lib";

@triggerComponent
export class BreadCrumb extends TriggerComponent<number> {
  main(_: TriggerComponentContext<this>, items: D<string[]>) {
    let itemsValue = getD(items);
    _._div({}, () => {
      _.for(itemsValue.slice(0, -1), byIndex, (item, i) => {
        _._span(
          {
            onclick: _.$fireWith(i),
          },
          item
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
    breadcrumb: BreadCrumb;
  }
}
