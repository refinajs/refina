<script setup>
import ListRenderingVue from "snippets/list-rendering.vue";
import ForTimesVue from "snippets/for-times.vue";
</script>

# 列表渲染

就像在 Vue.js 中一样，在渲染列表时需要为每个元素指定唯一的 `key`。

因此，不可以使用普通的循环来渲染列表。因为它们不接收 `key`。

需要使用 `_.for` 或 `_.forTimes` 等上下文你函数来渲染列表。

```ts
import { bySelf } from "refina";

const items = ["Apple", "Banana", "Orange"];

$app.use(Basics)(_ => {
  _.for(items, bySelf, item => {
    _.p(item);
  });
});
```

**运行结果**

<ListRenderingVue />

## key 生成器 {#key-generator}

`_.for` 的第二个参数是一个 key 生成器，用于为每个元素提供一个唯一的 key。

key 生成器可以是一个形式为 `(item, index) => key` 的函数，也可以是被作为 key 的元素属性的属性名。

Refina 提供了两个 key 生成器：

- `bySelf`: 将元素本身作为 key。
- `byIndex`: 将元素的索引作为 key。

## 重复一定次数 {#for-times}

可以使用 `_.forTimes` 来将渲染重复数次。

`_.forTimes` 没有 key 生成器。它将索引作为 key。

```ts
$app.use(Basics)(_ => {
  _.forTimes(5, index => {
    _.p(`This is the ${index + 1}th paragraph.`);
  });
});
```

**运行结果**

<ForTimesVue />
