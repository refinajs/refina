# 组件

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。

与 Vue.js 中的组件不同，Refina 中的组件**不**被用于将应用分成几个部分，对于这种需求，请使用[视图](./view.md)。

## 组件的种类

Refina 中有3种组件：

- **输出型组件**：只负责渲染页面内容的组件。 如：`h1`, `p`...
- **事件型组件**：会触发一个事件的组件。 如：`button`, `input`...
- **状态型组件**：含有一个状态的组件。 如：`checkbox`, `radio`...

:::info
The above three kinds of components are the most common use cases.

组件的底层实现是一个上下文函数。 所以创建一个不属于上述种类的组件是完全可行的。
:::

## 额外的 props {#extra-props}

有时一个组件有很多可选的 prop。这使得将这些 prop 通过组件函数参数传入十分不便。 这时我们可以使用 [`_.$props` 指令](../apis/directives.md#props) 向下一个组件以按名称传入的方式添加多个额外的 prop。

```ts
$app.use(MdUI)(_ => {
  _.$props({
    icon: "person",
    endIcon: "arrow_forward",
  });
  _.mdChip("Student", true);
});
```

:::info
额外的 prop 都是**可选的**。
:::

:::info
The props as parameters are declared in the different way by the component from the extra props.

所以你不能将额外的 prop 以组件函数参数的方式传入，反之亦然。
:::

## 主元素 {#main-element}

如果组件渲染了一个 DOM 元素（不包括文本节点），它就有一个主元素。主元素可以通过`componentInstance.$mainEl`属性获得。

If the component doesn't render any DOM element, its main element is `undefined`.

The main element should be the most important element in the component. And classes and styles applied to the component will be applied to the main element.

A component can specify the main element by calling `this.$main()`. If not specified, the first element will be the main element.

:::info
Elements rendered via low-level rendering functions also have a main element, which is always the element itself.
:::
