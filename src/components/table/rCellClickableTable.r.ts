import { Content, TriggerComponentContext, byIndex, bySelf, triggerComponent } from "../../lib";
import { HeaderItem, RTableBase, normalizeHeaders, sortRowsByCompareFn } from "./base";
import styles from "./styles";

export type RCellClickableTableEvent<
  Field extends string,
  ItemType extends Record<Field, Content> & object,
> = ItemType & {
  $rowIndex: number;
  $field: Field;
  $value: ItemType[Field];
};

@triggerComponent("rCellClickableTable")
export class RCellClickableTable<
  Field extends string,
  ItemType extends Record<Field, Content> & object,
> extends RTableBase<Field, ItemType, RCellClickableTableEvent<Field, ItemType>> {
  main(
    _: TriggerComponentContext<RCellClickableTableEvent<Field, ItemType>, this>,
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
            _._tr({}, () =>
              _.for(
                normalizedHeaders.map((v) => v.index),
                bySelf,
                (colIndex) =>
                  styles.td(true)(_) &&
                  _._td(
                    {
                      onclick: _.$fireWith({
                        ...item,
                        $rowIndex: rowIndex,
                        $field: colIndex,
                        $value: item[colIndex],
                      }),
                    },
                    item[colIndex],
                  ),
              ),
            ),
        ),
      );
    });
  }
}

declare module "../../context" {
  interface CustomContext<C> {
    rCellClickableTable: RCellClickableTable<any, any> extends C
      ? <Field extends string, ItemType extends Record<Field, Content> & object>(
          items: ItemType[],
          header: Record<Field, HeaderItem>,
        ) => this is {
          readonly $: RCellClickableTable<Field, ItemType>;
          readonly $ev: RCellClickableTableEvent<Field, ItemType>;
        }
      : never;
  }
}
