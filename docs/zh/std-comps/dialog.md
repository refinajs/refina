<script setup>
import Kind from "helpers/kind.vue";
import Optional from "helpers/optional.vue";
</script>

# The `Dialog` Component

The main function of the `Dialog` component is to toggle a boolean value.

<Kind>TriggerComponent</Kind>

**例子**

```ts
_.xDialog(
  (_, open) => {
    _.xButton("Open") && open();
  },
  "Title",
  _ => {
    _.p("Body");
  },
  (_, close) => {
    _.xButton("Accept") && close();
    _.xButton("Cancel") && close();
  },
);
```

## Param: `trigger`

**type**: `Content<[open: (open?: boolean) => void]>`

The trigger part of the dialog.

It will always be rendered inplace.

The trigger part can call the `open` function as a callback to open the dialog.

## Param: `title`

**type**: `Content<[close: (open?: boolean) => void]>`

The title part of the dialog.

## Param: `body`

**type**: `Content<[close: (open?: boolean) => void]>`

The body part of the dialog.

## Param: `actions`

<Optional/>

**type**: `Content<[close: (open?: boolean) => void]>`

The actions part of the dialog.

## Param: `persistent`

<Optional/> = `false`

**type**: `boolean`

If the dialog is persistent, it will not be closed when clicking outside of it, and there will be no default close button.

## Triggered when: `open` / `close`

**data type**: `boolean`

When the dialog is opened or closed, the new state will be emitted.
