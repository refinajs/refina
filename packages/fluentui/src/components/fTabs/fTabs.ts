import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import "./fTabList";
import styles from "./fTabs.styles";

type _R<T extends readonly any[], U extends readonly any[]> =
  | readonly []
  | readonly [...U, ...T];

// prettier-ignore
type RepeatedTuple<T extends readonly any[]> =
    _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
        _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
            _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T, _R<T,
                _R<T, _R<T, _R<T, _R<T, readonly []>>>>>
            >>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>
    >>>;

declare module "refina" {
  interface Components {
    fTabs(
      ...tabs: RepeatedTuple<[name: D<string>, content: D<Content>]>
    ): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fTabs = function (_) {
  let activeTab: string;
  return (...nameAndContents) => {
    const names: string[] = [],
      contents: D<Content>[] = [];
    for (let i = 0; i < nameAndContents.length; i += 2) {
      names.push(getD(nameAndContents[i]) as string);
      contents.push(nameAndContents[i + 1] as D<Content>);
    }

    activeTab ??= nameAndContents[0] as string;
    let selectedIndex = names.findIndex(name => name === activeTab);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      activeTab = names[0] as string;
    }

    styles.root(_);
    _._div({}, _ => {
      if (_.fTabList(selectedIndex, names, false)) {
        activeTab = names[_.$ev];
        this.$fire(activeTab);
      }
      styles.panels(_);
      _._div({}, contents[selectedIndex]);
    });
  };
};
