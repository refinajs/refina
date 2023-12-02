<script setup>
import ListRenderingVue from "../../components/list-rendering.r.vue";
import ForTimesVue from "../../components/for-times.r.vue";
</script>

# List Rendering

Just like Vue, a `key` attribute is required when rendering a list.

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

### The key generator

The second parameter of `_.for` is a key generator, which is used to generate keys for the items.

The key generator can be a function in the form of `(item, index) => key`, or a string which means the name of the property of the item to be used as the key.

There are also some built-in key generators:

- `bySelf`: use the item itself as the key.
- `byIndex`: use the index of the item as the key.

### Render for given times

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
