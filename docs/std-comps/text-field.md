<script setup>
import Kind from "./helpers/Kind.vue";
import Optional from "./helpers/Optional.vue";
</script>

# The `TextField` Component

Use the `TextField` component to input text.

Different from the `Textarea` component, the `TextField` component is a single-line input.

<Kind>TriggerComponent</Kind>

**Example**

```ts
if (_.xTextField(value, "Username", disabled)) {
  console.log(`New value: ${_.$ev}`);
}
```

## Param: `value`

**type**: `D<string>`

The value of the text field.

## Param: `label`

<Optional/>

**type**: `D<string>`

> ↑ `D<Content>` if HTML label is supported.

The label of the text field.

## Param: `placeholder`

<Optional/>

**type**: `D<string>`

The placeholder of the text field.

> May be combined with `label`.

## Param: `disabled`

<Optional/> = `false`

**type**: `D<boolean>`

Whether the text field is disabled.

## Triggered when: `input`

**data type**: `string`

When the value of the text field is changed, the new value will be emitted.
