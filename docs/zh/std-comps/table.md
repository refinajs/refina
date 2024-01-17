<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Table` Component

Render a table.

<Kind>OutputComponent</Kind>

**例子**

```ts
_.mdTable(
  data,
  [_ => _.mdIcon("person"), "Age", "Action"],
  "name",
  ({ name, age }) => {
    _.mdTableCell(name);
    _.mdTableCell(age);
    _.mdTableCell(_ => _.mdButton("Open") && alert(name));
  },
);
```

## Generic: `T`

The type of the data of one row.

## Param: `data`

**type**: `D<Iterable<T>>`

The data to render.

## Param `head`

**type**: `DArray<Content> | D<Content>`

The head of the table.

If it is an array, each item will be rendered as a `<th>`. Otherwise, it is the content of the `<thead>`.

## Param: `key`

**type**: `LoopKey<T>`

The key generator of the table. See [The Key Generator](../guide/essentials/list.md#key-generator).

## Param: `row`

**type**: `(item: T, index: number) => void`

The body of rows of the table.
