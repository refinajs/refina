<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `List` Component

Render a list of items.

<Kind>OutputComponent</Kind>

**Example**

```ts
_.xList(data, bySelf, item => {
  _.span(item);
  _.xButton("Remove");
});
```

## Generic: `T`

The type of the data of one row.

## Param: `data`

**type**: `Iterable<T>`

The data to render.

## Param: `key`

**type**: `LoopKey<T>`

The key generator of the list. See [The Key Generator](../guide/essentials/list.md#key-generator).

## Param: `body`

**type**: `(item: T, index: number) => void`

The body of rows of the list.
