<script setup>   
import EventHandling from "snippets/event-handling.vue";
</script>

# 事件处理

本节将介绍在 Refina 中如何处理事件。

```ts
let count = 0;

$app.use(Basics)(_ => {
  _.p(`Count is: ${count}`);

  _.button(`Add`) && count++;

  if (_.button("Reset")) {
    count = 0;
    console.log(_.$ev);
  }
});
```

**运行结果**

<EventHandling />

接下来是上面代码的解释。

### 定义状态

在上面的例子中，我们定义了一个名为 `count` 状态来存储计数值。

作为一个类 ImGUI 的框架，Refina 不需要一个”响应式系统“来监听状态的变化。

因此你可以直接以最普通的方式定义状态，即使用 `let` 语句。 即，不需要通过 `ref` 或 `reactive` 或 `useState` 来创建状态。

:::warning

You SHOULD NOT declare the states inside the main function.

否则，每当主函数被调用，这些状态就会被重置。

:::

### 事件处理

Because most of the components/elements have none or **only one** event that is frequently used, Refina uses the return value of the component function to indicate whether the event is triggered.

For instance, the return value of `_.button` is a boolean value, which indicates whether the button is clicked. And then you can use the `if` statement or the `&&` operator to handle the event.

:::tip

Only trigger components like `button` and `input` returns a boolean value which indicates whether the event is triggered.

其他类型的组件可能返回具有其他含义的值。

:::

:::info

As you can see, the way how Refina handles events is very similar to [Dear ImGui](https://github.com/ocornut/imgui).

:::

### Get the Event Data

The event data is stored in the context object, and you can get it by accessing `_.$ev`.

:::tip

Refina has type definitions for the event data, so you when you hover on `_.$ev`, you can see the type of the event data.

在事件处理部分外（即在判断事件是否发生的 `if` 语句或 `&&` 运算符外），`_.$ev` 的类型是 `never`。

:::

:::warning

You can't render a component in the event handler.

这是因为，事件处理部分在 RECV`状态下被执行，但是渲染的过程在`UPDATE\` 状态下被执行。

:::
