import { D, byIndex, getD, defineTrigger } from "../lib";

export type BreadCrumbItem = string;

declare module "../component" {
  interface ElementFuncs {
    breadcrumb: [never, [items: D<BreadCrumbItem[]>], never];
  }
}
defineTrigger({}, function breadcrumb(_, items: D<BreadCrumbItem[]>) {
  let itemsValue = getD(items);
  _._ul({}, () => {
    _.for(itemsValue.slice(0, -1), byIndex, (item) => {
      _._li({}, () => {
        _._span({}, item);
        _._span({}, " / ");
      });
    });
    _._li({}, () => {
      _._span({}, itemsValue.at(-1)!);
    });
  });
  return false;
});
