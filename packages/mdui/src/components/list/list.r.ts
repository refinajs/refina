import { ComponentContext, D, KeyFunc, OutputComponent } from "refina";
import MdUI from "../../plugin";

@MdUI.outputComponent("mdList")
export class MdList extends OutputComponent {
  main<T>(
    _: ComponentContext<this>,
    data: D<Iterable<T>>,
    key: KeyFunc<T>,
    body: (item: T, index: number) => void,
  ): void {
    _.$cls`mdui-list`;
    _._div({}, _ => {
      _.for(data, key, (item, index) => {
        _.$cls`mdui-list-item`;
        _._div({}, _ => {
          body(item, index);
        });
      });
    });
  }
}

declare module "refina" {
  interface CustomContext<C> {
    mdList: MdList extends C
      ? <T>(data: D<Iterable<T>>, key: KeyFunc<T>, body: (item: T, index: number) => void) => void
      : never;
  }
}
