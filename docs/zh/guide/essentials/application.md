# 创建一个 Refina 应用

## ​应用实例

每个 Refina 应用通过调用 `$app` 函数创建：

```ts
import { $app } from "refina";

$app(_ => {
  // 应用主体 （主函数）
  // ...
});
```

## 使用插件

通过调用 `$app.use` 向应用添加插件。

所有组件和工具函数都通过插件提供。所以插件是必不可少的一部分。

```ts
import { $app } from "refina";
import Basics from "@refina/basic-components";

$app.use(Basics)(_ => {
  // _.h1 由名为 Basics 的插件提供
  _.h1("Hello, Refina!");
});
```

若要使用多个插件，请链式调用 `$app.use` 方法：

```ts
$app.use(Plugin1).use(Plugin2, param1, param2).use(Plugin3)(_ => {
  // ...
});
```

事实上，属于Refina核心的组件和工具函数由名为 `Prelude` 插件的提供。这个插件在创建应用时会被自动添加。

:::warning

由于 TypeScript 的限制，如果仅导入插件却不安装它，其类型仍然在上下文对象中可见。 但是如果你使用这些实际上并没有安装的插件，会产生运行时错误。 但是如果你使用这些实际上并没有安装的插件，会产生运行时错误。

:::

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

默认的根元素是 `id` 为 `root` 的元素。

你可以将期望的根元素的 `id` 传入 `$app` 的第二个参数。

```ts
$app(_ => {
  // ...
}, "my-root");
```

## 多个应用实例

在同一个页面中可以创建多个共存的 Refina 应用。

你可以为每个应用指定不同的根元素。

```html
<body>
  <div id="root1"></div>
  <div id="root2"></div>
</body>
```

```ts
$app(_ => {
  // ...
}, "root1");

$app(_ => {
  // ...
}, "root2");
```
