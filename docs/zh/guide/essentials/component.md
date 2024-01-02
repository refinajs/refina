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

## Extra Props {#extra-props}

Sometimes there are many optional props for a component, and it is not convenient to write them all in the positional parameters. So we can use [the `_.$props` directive](../apis/directives.md#props) to add props to the next component as named parameters.

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

ALL the extra props are **optional**.

:::

:::info

The props as parameters are declared in the different way by the component from the extra props.

所以你不能将额外的 prop 以组件函数参数的方式传入，反之亦然。

:::

## The Main Element {#main-element}

If the component renders a DOM element (text node is excluded), it has a main element, which can be assessed via `componentInstance.$mainEl`.

If the component doesn't render any DOM element, its main element is `undefined`.

The main element should be the most important element in the component. And classes and styles applied to the component will be applied to the main element.

A component can specify the main element by calling `this.$main()`. If not specified, the first element will be the main element.

:::info

Elements rendered via low-level rendering functions also have a main element, which is always the element itself.

:::
