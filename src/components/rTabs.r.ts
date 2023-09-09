import { Content, D, OutputComponent, OutputComponentContext, byProp, outputComponent } from "../lib";

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

@outputComponent("rTabs")
export class RTabs extends OutputComponent {
  tab: string;

  main(_: OutputComponentContext<this>, ...nameAndContents: D<string | Content>[]) {
    this.tab ??= nameAndContents[0] as string;

    const tabs: {
      name: string;
      content: D<Content>;
    }[] = [];
    for (let i = 0; i < nameAndContents.length; i += 2) {
      tabs.push({
        name: nameAndContents[i] as string,
        content: nameAndContents[i + 1],
      });
    }
    _.$cls`m-3`;
    _.div(() => {
      _.$cls`flex`;
      _.div(() => {
        _.for(tabs, byProp("name"), ({ name }) => {
          _.$cls`inline-block px-4 py-2 cursor-pointer border-black
          ${
            this.tab === name
              ? " border-l-2 border-r-2 border-t-2 border-b "
              : " border-l border-r border-t border-b-2 "
          }`;
          if (_.button(name)) {
            this.tab = name;
          }
        });
        _.$cls`inline-block w-full border-b-2 border-black`;
        _._div();
      });
      _.$cls`border-l-2 border-r-2 border-b-2 border-black`;
      _.div(() => {
        _.for(tabs, byProp("name"), ({ name, content }) => {
          this.tab === name && _.$cls`p-3` && _.div(content);
        });
      });
    });
  }
}

declare module "../context" {
  interface CustomContext<C> {
    rTabs(...tabs: RepeatedTuple<[name: string, content: D<Content>]>): void;
  }
}
