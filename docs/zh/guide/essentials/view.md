# 视图

视图是一个函数，它渲染一部分页面。

它往往被用于拆分页面或复用页面重复出现的部分。

## 使用方式

**myView\.ts**

```ts
import { $view } from "refina";

export default $view(_ => {
  _.span("my view");
});
```

**app.ts**

```ts
import MyView from "./MyView.ts";

$app(_ => {
  _(MyView)();
  _.div(MyView.$func);
});
```

**渲染结果**

```html
<div>
  <span>my view</span>
</div>
<span>my view</span>
```

## `$view` API

`$view` 函数用于定义一个视图。

推荐将较大的视图编写在一个单独的文件中，并将这个视图作为默认导出。

## 传入视图参数 {#passing-parameters}

视图可以有参数。 你可以使用普通的语法定义视图参数：

```ts
export default $view((_, name: string, id?: number) => {
  _.p(_ => {
    _.t`My name is ${name}. `;
    id !== undefined && _.t(`My ID is ${id}.`);
  });
});
```

然后可以这样向视图传递参数：

```ts
_(MyView)("John", 123);
_(MyView)("Mary");
```

## 视图的状态

视图可以有状态，但是这些状态不属于视图，而是属于模块，它在所有使用它的视图中共享。

```ts
let count = 0;

export default $view(_ => {
  _.p(`Count is: ${count}`);
  _.button(`Add`) && count++;
});
```

:::warning

因为状态在所有使用它的视图中共享，需要小心使用它们。

:::

## 视图与组件的区别 {#view-vs-component}

视图可以被看做组件的简化版本。

它们的主要不同有：

- 组件被注册为上下文对象中的函数，而视图只是一个普通的函数。
- 每个组件实例有它专属的状态，而视图没有。
- 组件有 [`$mainEl` property](./component.md#main-element) 属性，并且可以向它添加类名和样式；视图则不行。
- 组件可以通过 [`_.$ref`](../apis/directives.md#ref) 指令引用其实例，而视图不行，因为视图没有实例。
- 组件可以有[额外的 props](./component.md#extra-props)，但是视图没有，视图只有普通的函数参数。

### 如何选择

如果你想复用**页面的片段**，可以使用 _视图_。

如果你想复用**有状态的代码**，你需要使用_组件_。

如果你是\*\*UI 库（组件库）\*\*作者，你总是应当提供_组件_。
