import {
  Content,
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  bySelf,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

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

@MdUI2.triggerComponent("mdTabs")
export class MdTabs extends TriggerComponent<string> {
  tabsRef = ref<HTMLElementComponent<"mdui-tabs">>();
  activeTab: string;
  main(_: Context, ...nameAndContents: (D<string> | D<Content>)[]) {
    const names: string[] = [],
      contents: D<Content>[] = [];
    for (let i = 0; i < nameAndContents.length; i += 2) {
      names.push(getD(nameAndContents[i]) as string);
      contents.push(nameAndContents[i + 1] as D<Content>);
    }

    this.activeTab ??= nameAndContents[0] as string;
    let selectedIndex = names.findIndex(name => name === this.activeTab);
    if (selectedIndex === -1) {
      selectedIndex = 0;
      this.activeTab = names[0] as string;
    }

    _.$ref(this.tabsRef) &&
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
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    mdTabs: MdTabs extends C["enabled"]
      ? (...tabs: RepeatedTuple<[name: D<string>, content: D<Content>]>) => void
      : never;
  }
}
