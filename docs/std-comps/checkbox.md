<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Checkbox` Component

The main function of the `Checkbox` component is to toggle a boolean value.

<Kind>TriggerComponent</Kind>

**Example**

```ts
if (_.xCheckbox(state, "Check me", disabled)) {
  alert(_.$ev ? "Checked!" : "Unchecked!");
}
```

## Param: `state`

**type**: `Model<boolean>`

> ↑ `Model<boolean|undefined>` if indeterminate state is supported

The state of the checkbox.

## Param: `label`

<Optional/>

**type**: `Content`

The label of the checkbox.

## Param: `disabled`

<Optional/> = `false`

**type**: `boolean`

Whether the checkbox is disabled.

## Triggered when: `change`

**data type**: `boolean`

> ↑ `boolean|undefined` if indeterminate state is supported

When the state of the checkbox is changed, the new state will be emitted.
