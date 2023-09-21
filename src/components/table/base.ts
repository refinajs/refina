import { Content, D, TriggerComponent, getD } from "../../lib";

export type HeaderItem =
  | true
  | {
      title?: D<string>;
      pos?: D<number>;
      sortable?: D<boolean>;
      sortFunc?: D<(a: unknown, b: unknown) => number>;
    };

export type NormalizedHeaderItem<Field extends string = string> = {
  index: Field;
  title: string;
  pos: number;
  sortable: boolean;
  compareFn?: (a: unknown, b: unknown) => number;
};

export function sortByPos<T extends NormalizedHeaderItem>(items: T[]) {
  const prepend = [] as T[];
  const middle = [] as T[];
  const append = [] as T[];
  for (const item of items) {
    const priority = getD(item.pos);
    if (priority > 0) {
      prepend.push(item);
    } else if (priority < 0) {
      append.push(item);
    } else {
      middle.push(item);
    }
  }

  function comparePriority(a: T, b: T) {
    return a.pos - b.pos;
  }
  return prepend
    .sort(comparePriority)
    .concat(middle)
    .concat(append.sort(comparePriority));
}

export function normalizeHeaders<Field extends string>(
  header: Record<Field, HeaderItem>,
) {
  return sortByPos(
    Object.entries(header as Record<string, HeaderItem>).map(
      ([k, v]): NormalizedHeaderItem<Field> => {
        if (v === true) {
          return {
            index: k as Field,
            title: k,
            pos: 0,
            sortable: false,
            compareFn: undefined,
          };
        }

        return {
          index: k as Field,
          title: getD(v.title) ?? k,
          pos: getD(v.pos) ?? 0,
          sortable: getD(v.sortable) ?? false,
          compareFn: getD(v.sortFunc),
        };
      },
    ),
  );
}

export function sortRowsByCompareFn<T, K extends keyof T>(
  normalizedHeaders: NormalizedHeaderItem[],
  items: T[],
  sortedIndex: K | null,
  ascending: boolean,
) {
  if (sortedIndex === null) return items;
  const compareFn = normalizedHeaders.find((v) => v.index === sortedIndex)
    ?.compareFn;
  items = items.toSorted((a, b) =>
    compareFn
      ? compareFn(a[sortedIndex], b[sortedIndex])
      : a[sortedIndex] > b[sortedIndex]
      ? 1
      : a[sortedIndex] < b[sortedIndex]
      ? -1
      : 0,
  );
  if (!ascending) {
    items.reverse();
  }
  return items;
}

export abstract class RTableBase<
  Field extends string,
  ItemType extends Record<Field, Content> & object,
  Ev,
> extends TriggerComponent<Ev> {
  sortIndex: Field | null = null;
  sortAsc = true;
  changedSortIndex(header: NormalizedHeaderItem<Field>) {
    if (header.sortable) {
      if (header.index === this.sortIndex) {
        if (this.sortAsc) {
          this.sortAsc = false;
        } else {
          this.sortIndex = null;
        }
      } else {
        this.sortIndex = header.index;
        this.sortAsc = true;
      }
    } else {
      this.sortIndex = null;
    }
  }
}
