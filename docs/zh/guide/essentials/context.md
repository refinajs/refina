# 上下文对象

Refina 的很多 API 通过上下文对象提供。

上下文对象被用于渲染组件、处理事件，等等。

上下文对象有3类成员：

- **组件函数**：调用它们以渲染组件/元素。
- **实用函数**：一些工具方法。
- **指令**：一些特殊的方法与属性。

:::warning
If you want to use non-directive properties, you MUST name the context object as `_`.

否则，编译时转换将不会工作，并将产生运行时错误。
:::

## 组件函数

渲染组件的唯一方法是调用其组件函数。

有3种组件函数：

1. **文本节点**：即`_.t`。
2. **底层元素**：原始的 DOM 元素，名称有 `_` 作为前缀，如 `_._div` 和 `_._svgPath`。
3. **插件提供的组件函数**：比如由 `Basics` 插件提供的 `_.button` 、由 `MdUI` 插件提供的 `_.mdButton`。 它们的名称不含有 `_` 前缀。

## 实用函数

这些函数作为工具被使用，比如用来控制渲染顺序、设置定时器等等。

它们的名称也不含有 `_` 前缀。

由 Refina 核心提供的使用函数参见 [Utility Context Functions](/guide/apis/util-funcs.md)。

## 指令

指令是上下文对象上一些特殊的属性与方法。

它们的名称都有 `$` 前缀。并且它们不会经过编译时转换。

由 Refina 核心提供的指令参见 [Directives](/guide/apis/directives.md)。
