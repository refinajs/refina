import { Content } from "refina";
import FluentUI from "../../../plugin";
import useStyles from "./styles";

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
    fTabs(...tabs: RepeatedTuple<[name: string, content: Content]>): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fTabs = function (_) {
  let activeTab: string;
  return (...nameAndContents) => {
    const names: string[] = [],
      contents: Content[] = [];
    for (let i = 0; i < nameAndContents.length; i += 2) {
      names.push(nameAndContents[i] as string);
      contents.push(nameAndContents[i + 1] as Content);
    }

    activeTab ??= nameAndContents[0] as string;
    let selectedIndex = names.findIndex(name => name === activeTab);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      activeTab = names[0] as string;
    }

    const styles = useStyles();

    styles.root();
    _._div({}, _ => {
      if (_.fTabList(selectedIndex, names, false)) {
        activeTab = names[_.$ev];
        this.$fire(activeTab);
      }
      styles.panels();
      _._div({}, contents[selectedIndex]);
    });
  };
};
