<script setup>
import Kind from "/std-comps/helpers/kind.vue";
import Optional from "/std-comps/helpers/optional.vue";
</script>

# The `Button` Component

The main function of the `Button` component is to trigger an action when clicked.

<Kind>TriggerComponent</Kind>

**Example**

```ts
if (_.xButton("Click me", disabled)) {
  alert("Clicked!");
}
```

## Param: `inner`

**type**: `D<Content>`

The content of the button.

## Param: `disabled`

<Optional/> = `false`

**type**: `D<boolean>`

Whether the button is disabled.

## Triggered when: `click`

**data type**: `void` _(Can be `MouseEvent`)_

When the button is clicked, the event will be emitted.