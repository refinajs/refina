import {
  Content,
  D,
  Maybe,
  OutputComponent,
  OutputComponentContext,
  View,
  getD,
  isMaybe,
  justSomething,
  outputComponent,
} from "../lib";

@outputComponent("rPopup")
export class RPopup<T extends {}> extends OutputComponent {
  main(_: OutputComponentContext<this>, open: D<boolean>, inner: D<Content>): void;
  main(_: OutputComponentContext<this>, open: D<Maybe<T>>, inner: D<Content | View<[data: T]>>): void;
  main(
    _: OutputComponentContext<this>,
    open: D<boolean> | D<Maybe<T>>,
    inner: D<Content> | D<Content | View<[data: T]>>,
  ) {
    const openValue = getD(open),
      innerValue = getD(inner);
    if (openValue === true || justSomething(openValue)) {
      _.$cls`z-[2400] bg-[rgba(0,0,0,0.32)] fixed w-full h-full top-0 left-0 justify-center items-center flex`;
      if (
        _.button(() => {
          _.$cls`max-w-[calc(100%-48px)] w-auto text-left`;
          if (typeof innerValue === "function" && isMaybe(openValue)) {
            _.div((_) => innerValue(_, openValue.value));
          } else {
            _.div(innerValue as Content);
          }
        }) &&
        _.$ev.$isCurrent
      ) {
        if (isMaybe(openValue)) {
          _.$clearMaybe(openValue);
        } else {
          _.$setD(open, false);
        }
      }
    }
  }
}

declare module "../context" {
  interface CustomContext<C> {
    rPopup: RPopup<any> extends C
      ? ((open: D<boolean>, inner: D<Content>) => void) &
          (<T extends {}>(open: D<Maybe<T>>, inner: D<Content | View<[data: T]>>) => void)
      : never;
  }
}
