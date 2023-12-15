import { Content, D, HTMLElementComponent, bySelf, getD, ref } from "refina";
import MdUI from "../plugin";

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
    mdTabs(
      ...tabs: RepeatedTuple<[name: D<string>, content: D<Content>]>
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdTabs = function (_) {
  const tabsRef = ref<HTMLElementComponent<"mdui-tabs">>();
  let activeTab: string;
  return ((...nameAndContents: (D<string> | D<Content>)[]) => {
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

    _.$ref(tabsRef) &&
      _._mdui_tabs(
        {
          value: activeTab,
          onchange: () => {
            const newActiveTab = tabsRef.current!.node.value!;
            activeTab = newActiveTab;
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
  }) as unknown as (
    ...tabs: RepeatedTuple<[name: D<string>, content: D<Content>]>
  ) => void;
};
