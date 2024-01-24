# 组件

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。

Unlike components in other frameworks, where components are also used to split the app into several parts, it is preferred to use [view](./view.md) to split the app in Refina.

## 组件的种类

Refina 中有3种组件：

- **输出型组件**：只负责渲染页面内容的组件。 如：`h1`, `p`...
- **事件型组件**：会触发一个事件的组件。 如：`button`, `input`...
- **状态型组件**：含有一个状态的组件。 如：`checkbox`, `radio`...

:::info

以上三种是常用的组件种类。

组件的底层实现是一个上下文函数。 所以创建一个不属于上述种类的组件是完全可行的。

:::

## 额外的 props {#extra-props}

有时一个组件有很多可选的 props。这使得将这些 props 通过组件函数参数传入十分不便。 这时我们可以使用 [`_.$props` 指令](../apis/directives.md#props) 向下一个组件以按名称传入的方式添加多个额外的 prop。

```ts
$app([MdUI], _ => {
  _.$props({
    icon: "person",
    endIcon: "arrow_forward",
  });
  _.mdChip("Student", true);
});
```

:::info

额外的 props 都是**可选的**。

:::

:::info

额外的 props 与组件的参数以完全不同的方式定义。

因此你不能将额外的 props 以组件函数参数的方式传入，反之亦然。

:::

## The Primary Element {#primary-element}

If the component renders a DOM element (text node is excluded), it has a primary element, which can be assessed via `componentInstance.$primaryEl`.

If the component doesn't render any DOM element, its primary element is `undefined`.

The primary element should be the most major element in the component. Classes and styles applied to the component will be forwarded to the primary element.

A component can specify the primary element by calling `this.$primary()`. If not specified, the first element will be the primary element.

:::info

Elements rendered via low-level rendering functions also have a primary element, which is always the element itself.

:::
