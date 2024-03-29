<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `RadioGroup` Component

The `RadioGroup` component is a group of radio buttons. Users can select one of them.

<Kind>TriggerComponent</Kind>

**Example**

```ts
_.xRadioGroup(selected, ["A", "B", "C"], allDisabled, {
  A: _ => _._span("A"),
});
_.xRadioGroup<"A" | "B" | "C">(
  selected,
  ["A", "B", "C"],
  [disableA, disableB, disableC],
);
```

## Generic: `Value`

**extends**: `string`

The option value type.

## Param: `selected`

**type**: `Model<Value>`

The currently selected value.

## Param: `options`

**type**: `readonly Value[]`

The options.

## Param: `disabled`

<Optional/> = `false`

**type**: `boolean | readonly boolean[]`

If the value is an array, it will be used to disable each option. Otherwise, it will be used to disable all options.

## Param: `contentOverride`

<Optional/> = `{}`

**type**: `Partial<Record<Value, Content>>`

By default, the content of each option is the value itself. You can override it by passing a record mapping each value to its content.

## Triggered when: `change`

**data type**: Generic `Value`

When the selected value is changed, the new value will be emitted.
