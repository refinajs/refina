import {
  Content,
  Context,
  D,
  Maybe,
  TriggerComponent,
  TriggerComponentContext,
  View,
  getD,
  isMaybe,
  triggerComponent,
} from "refina";

@triggerComponent("rDialog")
export class RDialog<T extends object> extends TriggerComponent<number> {
  close: () => true;
  main(
    _: TriggerComponentContext<number, this>,
    open: D<boolean>,
    heading: D<Content>,
    body: D<Content>,
    closeButton: D<string | boolean>,
    buttons?: D<D<Content>[]>,
    disabled?: D<D<boolean>[]>,
  ): void;
  main(
    _: TriggerComponentContext<number, this>,
    open: D<Maybe<T>>,
    heading: D<Content | View<[data: T]>>,
    body: D<Content | View<[data: T]>>,
    closeButton?: D<string | boolean>,
    buttons?: D<D<Content | View<[data: T]>>[]>,
    disabled?: D<D<boolean>[]>,
  ): void;
  main(
    _: TriggerComponentContext<number, this>,
    open: D<boolean> | D<Maybe<T>>,
    heading: D<Content> | D<Content | View<[data: T]>>,
    body: D<Content> | D<Content | View<[data: T]>>,
    closeButton: D<string | boolean> = false,
    buttons: D<D<Content>[]> | D<D<Content | View<[data: T]>>[]> = [],
    disabled: D<D<boolean>[]> = [],
  ) {
    const openValue = getD(open);
    const closeButtonRaw = getD(closeButton);
    const hasCloseButton = closeButtonRaw !== false;
    const closeButtonText = closeButtonRaw === true ? "Close" : (closeButtonRaw as string);

    if (isMaybe(openValue)) {
      this.close = () => {
        _.$clearMaybe(openValue);
        return true;
      };

      _.rPopup(openValue, (_unused, value) => {
        function feedMaybeValue(inner: D<Content | View<[data: T]>>) {
          if (typeof inner === "function") {
            return (_: Context) => inner(_, value);
          }
          return inner as D<Content>;
        }
        if (hasCloseButton) {
          if (
            _.rCard(
              feedMaybeValue(heading),
              feedMaybeValue(body),
              [closeButtonText, ...getD(buttons).map(feedMaybeValue)],
              [false, ...getD(disabled)],
            )
          ) {
            if (_.$ev === 0) {
              this.close();
            } else {
              _.$fire(_.$ev - 1);
            }
          }
        } else {
          if (_.rCard(feedMaybeValue(heading), feedMaybeValue(body), getD(buttons).map(feedMaybeValue), disabled)) {
            _.$fire(_.$ev);
          }
        }
      });
    } else {
      this.close = () => _.$setD(open, false) || true;
      _.rPopup(open as D<boolean>, () => {
        if (hasCloseButton) {
          if (
            _.rCard(
              heading as D<Content>,
              body as D<Content>,
              [closeButtonText, ...getD(buttons as D<D<Content>[]>)],
              [false, ...getD(disabled)],
            )
          ) {
            if (_.$ev === 0) {
              this.close();
            } else {
              _.$fire(_.$ev - 1);
            }
          }
        } else {
          if (_.rCard(heading as D<Content>, body as D<Content>, buttons as D<D<Content>[]>, disabled)) {
            _.$fire(_.$ev);
          }
        }
      });
    }
  }
}

declare module "refina" {
  interface CustomContext<C> {
    rDialog: RDialog<any> extends C
      ? ((
          open: D<boolean>,
          heading: D<Content>,
          body: D<Content>,
          closeButton?: D<string | boolean>,
          buttons?: D<D<Content>[]>,
          disabled?: D<D<boolean>[]>,
        ) => this is {
          $: RDialog<never>;
          $ev: number;
        }) &
          (<T extends {}>(
            open: D<Maybe<T>>,
            heading: D<Content | View<[data: T]>>,
            body: D<Content | View<[data: T]>>,
            closeButton?: D<string | boolean>,
            buttons?: D<D<Content | View<[data: T]>>[]>,
            disabled?: D<D<boolean>[]>,
          ) => this is {
            $: RDialog<T>;
            $ev: number;
          })
      : never;
  }
}
