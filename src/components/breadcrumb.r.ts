import { D, byIndex, getD, defineTrigger } from "../lib";

export class BreadCrumb {}
declare module "../component" {
  interface TriggerComponents {
    breadcrumb: [BreadCrumb, [items: D<string[]>], never];
  }
}
defineTrigger(BreadCrumb, function breadcrumb(_, items: D<string[]>) {
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
});
