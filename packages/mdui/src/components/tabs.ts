import { Content, TriggerComponent, _, bySelf, elementRef } from "refina";

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

export class MdTabs extends TriggerComponent {
  tabsRef = elementRef<"mdui-tabs">();
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

    _.$ref(this.tabsRef);
    _._mdui_tabs(
      {
        value: this.activeTab,
        onchange: () => {
          const newActiveTab = this.tabsRef.current!.node.value!;
          this.activeTab = newActiveTab;
          this.$fire(newActiveTab);
        },
      },
      _ => {
        _.for(names, bySelf, name => _._mdui_tab({ value: name }, name));
        _.for(names, bySelf, (name, index) => {
          _._mdui_tab_panel({ slot: "panel", value: name }, contents[index]);
        });
      },
    );
    return this.$fired;
  }
}
