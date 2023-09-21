import { Content, TriggerComponentContext, byIndex, bySelf, triggerComponent } from "../../lib";
import { HeaderItem, RTableBase, normalizeHeaders, sortRowsByCompareFn } from "./base";
import styles from "./styles";

export type RRowClickableTableEvent<ItemType extends object> = ItemType & {
  $rowIndex: number;
};

@triggerComponent("rRowClickableTable")
export class RRowClickableTable<
  Field extends string,
  ItemType extends Record<Field, Content> & object,
> extends RTableBase<Field, ItemType, RRowClickableTableEvent<ItemType>> {
  main(
    _: TriggerComponentContext<RRowClickableTableEvent<ItemType>, this>,
    items: ItemType[],
    headers: Record<Field, HeaderItem>,
  ): void {
    const normalizedHeaders = normalizeHeaders(headers);
    items = sortRowsByCompareFn(normalizedHeaders, items, this.sortIndex, this.sortAsc);
    styles.table(_);
    _._table({}, () => {
      styles.thead(_);
      _._thead({}, () =>
        _.for(
          normalizedHeaders,
          (header) => header.title,
          (header) => {
            styles.th(_) &&
              _._th({}, () => {
                if (
                  _.button(() => {
                    _.t(header.title);
                    this.sortIndex !== header.index && _.$cls`invisible`;
                    _.span(this.sortAsc ? "▲" : "▼");
                  })
                ) {
                  this.changedSortIndex(header);
                }
              });
          },
        ),
      );
      styles.tbody(_);
      _._tbody({}, () =>
        _.for(
          items,
          byIndex,
          (item, rowIndex) =>
            styles.tr(_) &&
            _._tr(
              {
                onclick: _.$fireWith({ ...item, $rowIndex: rowIndex }),
              },
              () =>
                _.for(
                  normalizedHeaders.map((v) => v.index),
                  bySelf,
                  (colIndex) => styles.td(false)(_) && _._td({}, item[colIndex]),
                ),
            ),
        ),
      );
    });
  }
}

declare module "../../context" {
  interface CustomContext<C> {
    rRowClickableTable: RRowClickableTable<any, any> extends C
      ? <Field extends string, ItemType extends Record<Field, Content> & object>(
          items: ItemType[],
          header: Record<Field, HeaderItem>,
        ) => this is {
          readonly $: RRowClickableTable<Field, ItemType>;
          readonly $ev: ItemType;
        }
      : never;
  }
}
