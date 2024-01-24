# 创建一个 Refina 应用

## ​应用实例

每个 Refina 应用通过调用 `$app` 函数创建：

```ts
import { $app } from "refina";

$app([], _ => {
  // The main function of the app
  // ...
});
```

## 使用插件

所有组件和工具函数都通过插件提供。所以插件是必不可少的一部分。

The first parameter of `$app` can be an array of plugins:

```ts
$app([Plugin1, Plugin2(param1, param2), Plugin3], _ => {
  // ...
});
```

However, TypeScript doesn't know what plugins are used unless you declare them explicitly. So the `Plugins` interface should be declared:

```ts
declare module "refina" {
  interface Plugins {
    Plugin1: typeof Plugin1;
    Plugin2: typeof Plugin2;
    Plugin3: typeof Plugin3;
  }
}
```

事实上，属于Refina核心的组件和工具函数由名为 `Prelude` 插件的提供。这个插件在创建应用时会被自动添加。

## 主函数

主函数是页面的主体，负责构建页面和处理事件。

不但应用（`App`）有主函数，每个视图（`View`）和组件（`Component`）也有主函数。

主函数的第一个参数是上下文对象。通过上下文对象可以进行渲染组件、处理事件等等操作。

:::warning

必须将上下文对象（即第一个参数）命名为 `_`。

否则，编译时转换将不会工作，并将产生运行时错误。

:::

## 根元素

根元素是应用挂载在 DOM 中的容器元素。

By default, the root element is selected by `"#app"`.

You can change the root element by the `root` option:

```ts
$app(
  { plugins: [], root: "#my-root" },
  _ => {
    // ...
  },
  "my-root",
);
```
