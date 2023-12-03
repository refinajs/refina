<script setup>
import ConditionalRenderingVue from "../../components/conditional-rendering.r.vue";
</script>

# Conditional Rendering

Just like JSX, you can use the `if-else` statement to conditionally render components.

```ts
let count = 0;

app.use(Basics)(_ => {
  _.p(`Count is: ${count}`);

  _.button(`Add`) && count++;

  if (count > 0) {
    _.button("Reset") && (count = 0);
  }
});
```

**Result**

<ConditionalRenderingVue />
