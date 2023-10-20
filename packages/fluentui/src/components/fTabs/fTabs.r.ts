import { ComponentContext, Content, D, TriggerComponent, getD } from "refina";
import FluentUI from "../../plugin";
import "./fTabList.r";
import styles from "./fTabs.styles";

type _R<T extends readonly any[], U extends readonly any[]> = readonly [] | readonly [...U, ...T];

// prettier-ignore
type RepeatedTuple<T extends readonly any[]> =
    _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
        _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
            _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
                _R<T, _R<T, _R<T, _R<T, readonly []>>>>>
            >>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>
    >>>;

@FluentUI.triggerComponent("fTabs")
export class FTabs extends TriggerComponent<string> {
  selected: string;
  main(_: ComponentContext<this>, ...nameAndContents: (D<string> | D<Content>)[]) {
    const names: string[] = [],
      contents: D<Content>[] = [];
    for (let i = 0; i < nameAndContents.length; i += 2) {
      names.push(getD(nameAndContents[i]) as string);
      contents.push(nameAndContents[i + 1] as D<Content>);
    }

    this.selected ??= nameAndContents[0] as string;
    let selectedIndex = names.findIndex(name => name === this.selected);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      this.selected = names[0] as string;
    }

    styles.root(_);
    _._div({}, _ => {
      if (_.fTabList(selectedIndex, names, false)) {
        this.selected = names[_.$ev];
        this.$fire(this.selected);
      }
      styles.panels(_);
      _._div({}, contents[selectedIndex]);
    });
  }
}

declare module "refina" {
  interface CustomContext<C> {
    fTabs: FTabs extends C ? (...tabs: RepeatedTuple<[name: D<string>, content: D<Content>]>) => void : never;
  }
}
