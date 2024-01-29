<script setup>
import ConditionalRenderingVue from "snippets/conditional-rendering.vue";
</script>

# 条件渲染

就像 JSX 中一样，你可以直接使用普通的 `if-else` 语句来根据条件决定是否渲染元素。

```ts
let count = 0;

$app([Basics], _ => {
  _.p(`Count is: ${count}`);

  _.button(`Add`) && count++;

  if (count > 0) {
    _.button("Reset") && (count = 0);
  }
});
```

**运行结果**

<ConditionalRenderingVue />

:::tip

可以使用 `&&` 运算符来根据条件渲染组件：

```ts
input.length > 0 && _.button("Clear");
```

:::
