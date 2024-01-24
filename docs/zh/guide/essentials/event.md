<script setup>   
import EventHandling from "snippets/event-handling.vue";
</script>

# 事件处理

本节将介绍在 Refina 中如何处理事件。

```ts
let count = 0;

$app([Basics], _ => {
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

**不能**在主函数内部定义状态。

否则，每当主函数被调用，这些状态就会被重置。

:::

### 事件处理

因为大部分组件或元素没有或**仅有一个**常用的事件，Refina 以返回值的形式体现事件是否被触发。

比如，`_.button` 的返回值是一给布尔值。当按钮被按下时，`_.button` 会返回一次 `true`，其余时刻，它将返回 `false`。 因此你可以使用 `if` 语句或 `&&` 运算符来处理该事件。 因此你可以使用 `if` 语句或 `&&` 运算符来处理该事件。

:::tip

只有事件型组件，如 `button` 和 `input` 会返回表示事件是否发生的布尔值。

其他类型的组件可能返回具有其他含义的值。

:::

:::info

正如你看见的那样，Refina 的事件处理的写法与 [Dear ImGui](https://github.com/ocornut/imgui) 是否相似。

:::

### 获取事件数据

事件所携带的数据被存放在上下文对象种。你可以通过 `_.$ev` 属性读取它。

:::tip

Refina 为 `_.$ev` 标注了类型，所以当鼠标悬停在 `_.$ev` 上时，你可以看见事件数据的类型。

在事件处理部分外（即在判断事件是否发生的 `if` 语句或 `&&` 运算符外），`_.$ev` 的类型是 `never`。

:::

:::warning

**不能**在负责处理事件的代码中渲染组件。

这是因为，事件处理部分在 RECV`状态下被执行，但是渲染的过程在`UPDATE\` 状态下被执行。

:::
