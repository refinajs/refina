<script setup>
import ListRenderingVue from "../../snippets/list-rendering.vue";
import ForTimesVue from "../../snippets/for-times.vue";
</script>

# List Rendering

Just like Vue.js, a `key` attribute is required when rendering a list.

So you can't use the `for` or `while` statement, because they don't have a `key` attribute.

Instead, you can use the `_.for` and `_.forTimes` context function.

```ts
import { bySelf } from "refina";

const items = ["Apple", "Banana", "Orange"];

app.use(Basics)(_ => {
  _.for(items, bySelf, item => {
    _.p(item);
  });
});
```

**Result**

<ListRenderingVue />

## The Key Generator {#key-generator}

The second parameter of `_.for` is a key generator, which is used to generate keys for each item.

The key generator can be a function in the form of `(item, index) => key`, or the key of the property to be used as the key.

There are also two provided key generators:

- `bySelf`: use the item itself as the key.
- `byIndex`: use the index of the item as the key.

## Render for Given Times {#for-times}

You can use `_.forTimes` to render for given times.

The key generator of `_.forTimes` is omitted, and the index of the item is used as the key.

```ts
app.use(Basics)(_ => {
  _.forTimes(5, index => {
    _.p(`This is the ${index + 1}th paragraph.`);
  });
});
```

**Result**

<ForTimesVue />
