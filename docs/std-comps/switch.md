<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Switch` Component

The main function of the `Switch` component is to toggle a boolean value.

<Kind>TriggerComponent</Kind>

**Example**

```ts
if (_.xSwitch(checked, "Switch me", disabled)) {
  alert(_.$ev ? "On!" : "Off!");
}
```

## Param: `checked`

**type**: `Model<boolean>`

The state of the switch.

## Param: `label`

<Optional/>

**type**: `Content`

The label of the switch.

## Param: `disabled`

<Optional/> = `false`

**type**: `boolean`

Whether the switch is disabled.

## Triggered when: `change`

**data type**: `boolean`

When the state of the switch is changed, the new state will be emitted.
