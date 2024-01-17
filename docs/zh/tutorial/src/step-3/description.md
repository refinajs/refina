# 添加样式与类名

在上一步中，我没学习了如何使用上下文对象中的**组件函数**来渲染组件。 上下文对象中还有**指令**。 在这一步中，我们将学习使用两个指令：`_.$cls` 和 `_.$css`。

`_.$cls` 用于向下一个渲染的组件添加类名。 它既可以是普通函数也可以是标签函数：

```ts
_.$cls`foo`;
_.div();
// <div class="foo"></div>
```

`_.$css` 用于向下一个渲染的组件添加样式（相当于元素的 `style` 属性）。 它和 `_.$cls` 用法一致：

```ts
_.$css`color:red`;
_.div();
// <div style="color:red;"></div>
```

你还可以一起使用 `_.$cls` 和 `_.$css`，并可以连续使用多次：

```ts
_.$cls`foo`;
_.$cls`bar`;
_.$css`color:red`;
_.div();
// <div class="foo bar" style="color:red;"></div>
```

现在，试着给编辑器中的 `<h1>` 元素添加一些样式和类名。
