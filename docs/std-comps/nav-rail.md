<script setup>
import Kind from "./helpers/kind.vue";
import Optional from "./helpers/optional.vue";
</script>

# The `NavRail` Component

The `NavRail` component is a navigation rail. It is usually used to navigate between pages.

It is displayed as a vertical list of buttons on the left side of the screen.

<Kind>StatusComponent</Kind>

**Example**

```ts
const currentPage = _.mdNavRail([
  ["Lobby", "home"],
  ["About", "info"],
]);
_.embed(pages[currentPage]);
```

## Generic: `Value`

**extends**: `string`

The item value type.

## Param: `items`

**type**: `DReadonlyArray<[value: Value, iconName?: string]><[value: Value, iconName?: string]>`

The item' values (which is displayed as texts by default) and icon names.

## Param: `contentOverride`

<Optional/> = `{}`

**type**: `DPartialRecord<Value, Content>`

By default, the text of each item is the value itself. You can override it by passing a record mapping each value to its content.

## Status: Active item

**type**: `Value`

The value of the active item.
