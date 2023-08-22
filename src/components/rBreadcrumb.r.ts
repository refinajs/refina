import { D, TriggerComponent, TriggerComponentContext, byIndex, getD, triggerComponent } from "../lib";

@triggerComponent("rBreadcrumb")
export class RBreadcrumb extends TriggerComponent<number> {
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
  }
}
declare module "../component/index" {
  interface TriggerComponents {
    rBreadcrumb: RBreadcrumb;
  }
}
