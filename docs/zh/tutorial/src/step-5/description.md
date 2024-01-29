# 事件处理

我们可以通过检查组件函数的返回值来接收事件：

```ts {2-4}
$app([Basics], _ => {
  if (_.button("Click me!")) {
    console.log("Clicked!", _.$ev);
  }
});
```

只有在按钮被按下后，对应的 `_.button` 函数调用会返回 `true`，然后 `if` 内部的语句会被执行。 这些语句就是处理事件的代码。

`_.$ev` 是事件所携带的数据。 对于 `_.button`，它是一个 `MouseEvent` 对象。 `_.$ev` 只在事件处理部分可用。

你可以在事件处理代码中更新状态。

```ts {4}
let click = false;

$app([Basics], _ => {
  _.button("Click me!") && (clicked = true);
  clicked && _.p("Clicked!");
});
```

<!--

:::warning Do not update states outside the event handler.

The following code will cause undefined behavior:

```ts
let n = 0;
$app(_ => {
  n++;
});
```

`n` will be incremented every time the fragment is called, which is not predictable.

:::

-->

在所有事件被处理之后，Refina 会自动更新页面。

现在，试着自己实现一个显示点击按钮的次数的计数器。
