<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Slider` Component

Use the `Slider` component to select a value from a range.

<Kind>TriggerComponent</Kind>

**例子**

```ts
if (_.xSlider(value, disabled, step, min, max)) {
  alert(`New value: ${_.$ev}`);
}
```

## Param: `value`

**type**: `D<number>`

The percentage of the slider, from 0 to 100.

## Param: `disabled`

<Optional/> = `false`

**type**: `D<boolean>`

Whether the slider is disabled.

## Param: `step`

<Optional/> = `1`

**type**: `D<number>`

The step of the slider.

## Param: `min`

<Optional/> = `0`

**type**: `D<number>`

The minimum value of the slider.

## Param: `max`

<Optional/> = `100`

**type**: `D<number>`

The maximum value of the slider.

## Triggered when: `change`

**data type**: `number`

When the value of the slider is changed, the new value will be emitted.
