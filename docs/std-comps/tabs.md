<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Tabs` Component

Displays a set of tabs, and only one tab is visible at a time.

<Kind>TriggerComponent</Kind>

**Example**

```ts
_.xTabs(
  "Tab 1",
  _ => _._p({}, "Content 1"),
  "Tab 2",
  _ => _._p({}, "Content 2"),
  "Tab 3",
  _ => _._p({}, "Content 3"),
);
```

## Params: `...tabs`

**type**: `RepeatedTuple<[name: D<string>, content: D<Content>]>` (An alternating list of `D<string>` and `D<Content>`).

The tab names and contents.

For the odd indices, the value is the tab name.

For the even indices, the value is the tab content.

## Triggered when: `change`

**data type**: `string`

When the active tab changes, the new tab name will be emitted.
