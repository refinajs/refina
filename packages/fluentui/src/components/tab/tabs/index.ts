import { Content, TriggerComponent, _ } from "refina";
import useStyles from "./styles";
import { FTabList } from "../tabList";

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

export class FTabs extends TriggerComponent {
  activeTab: string;
  $main(...tabs: RepeatedTuple<[name: string, content: Content]>): this is {
    $ev: string;
  } {
    const names: string[] = [],
      contents: Content[] = [];
    for (let i = 0; i < tabs.length; i += 2) {
      names.push(tabs[i] as string);
      contents.push(tabs[i + 1] as Content);
    }

    this.activeTab ??= tabs[0] as string;
    let selectedIndex = names.findIndex(name => name === this.activeTab);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      this.activeTab = names[0] as string;
    }

    const styles = useStyles();

    styles.root();
    _._div({}, _ => {
      if (_(FTabList)(selectedIndex, names, false)) {
        this.activeTab = names[(_ as any).$ev];
        this.$fire(this.activeTab);
      }
      styles.panels();
      _._div({}, contents[selectedIndex]);
    });
    return this.$fired;
  }
}
