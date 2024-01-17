# 列表渲染

使用 `_.for` 组件来渲染列表一个基于数组的列表：

```ts
const todos = [
  { id: 1, text: "Buy milk" },
  { id: 2, text: "Do homework" },
  { id: 3, text: "Read a book" },
];

$app.use(Basics)(_ => {
  _.for(todos, "id", item => {
    _.p(item.text);
  });
});
```

注意我们还通过 `_.for` 的第二个参数给每个 todo 对象设置了唯一的 key。 这允许 Refina 能够精确的移动每个 `<p>`，以匹配对应的对象在数组中的位置。

这个 key 可以是列表元素的一个键名，或者一个返回 key 的函数。 Refina 还提供了 `bySelf` 和 `byIndex` 这两个可以作为 key 的函数。

一些组件自身也具备 `_.for` 的用法和功能，比如 `_.ul` 与 `_.ol`。

现在，尝试完成这个 todo 列表。
