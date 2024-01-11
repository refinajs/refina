# 标准组件

本章节描述了 Refina 定义的标准组件。

Refina 的标准组件是常用的，且*有一定复杂度*的组件。 不能保证所有组件库都会包含所有这些标准组件。 但组件库应当尽可能地覆盖标准组件，并符合标准组件的接口。

:::warning

标准组件在不同的 UI 库中可能有不同的实现。

一些特性在有些 UI 风格中不可用，而有些 UI 风格会提供一些专有的特性。

:::

:::tip

在本文档的示例中，我们使用 `x` 前缀来表示标准组件。 比如，`_.xButton`。

但是，在实际开发中，需要加上你所使用的组件库的前缀。 比如，MdUI 中的按钮是 `_.mdButton`，而在 FluentUI 中是 `_.fButton`。

由 `@refina/basic-components` 提供的组件没有前缀。 比如 `_.button`。

:::

:::info

一些过于简单和显然的不属于标准组件的范畴。 比如，`_.span` 与 `_.mdIcon`。

一些只在少数组件库中包含的组件也不属于标准组件的范畴。 比如，`_.mdAppBarTitle`。

:::

## 目前可用的组件库

以下组件库目前已经可用：

[![@refina/basic-components](https://img.shields.io/npm/v/%40refina%2Fbasic-components?label=%40refina%2Fbasic-components&color=green)](https://www.npmjs.com/package/@refina/basic-components)

[![@refina/mdui](https://img.shields.io/npm/v/%40refina%2Fmdui?label=%40refina%2Fmdui&color=green)](https://www.npmjs.com/package/@refina/mdui)
