# 应用状态

应用实例总是处于以下3个状态中的一个：

- `IDLE`: 主函数不在运行。
- `UPDATE`: 渲染并更新页面中。
- `RECV`: 接收并处理事件中。

![应用状态流程图](/media/app-states.png)

## `IDLE` 状态

当 `UPDATE` 状态结束后，应用进入 `IDLE` 状态。

## `UPDATE` 状态

有三种方式会使得应用进入 `UPDATE` 状态：

- 应用被挂载（初次创建）。
- 应用实例的 `update` 方法被调用。
- 事件队列被清空。

在 `UPDATE` 状态下，应用将生成 DOM tree 并更新页面。

:::tip

多个 `UPDATE` 调用请求将被合并成一个。

:::

:::danger

不应当在 `UPDATE` 状态下改变变量。

以下代码是错误的。它会造成未定义行为。

```ts
let count = 0;
$app([Basics], _ => {
  _.p(`Count is: ${count}`);
  count++; // count 在 UPDATE 状态下也会被改变
});
```

:::

## `RECV` 状态

当侦听到事件时，应用进入 `RECV` 状态。

只有在这个状态下，事件型组件的返回值可能是真值（当它就是事件的接收者时）。

当 `RECV` 状态结束后，应用会进入 `UPDATE` 状态以更新页面。

:::danger

不能在 `RECV` 状态下修改 DOM。

以下代码是错误的。它会造成未定义行为。

```ts
$app([Basics], _ => {
  if (_.button("Click me")) {
    _.p("Hello");
  }
});
```

:::
