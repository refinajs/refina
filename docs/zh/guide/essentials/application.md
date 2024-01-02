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

Because of the limitations of TypeScript, the component functions provided by plugins that are imported but not installed are still visible in the context object in the IDE. But a runtime error will occur if you use them.

:::

## The Main Function

The main function is where you construct the page and handle events.

Not only `App`, but also `View` and `Component` have a main function.

The first parameter of the main function is a `Context` object, which is used to do almost everything like rendering components, handling events, etc.

:::warning

You can only name the first param of the main function (the context object) as `_`.

否则，编译时转换将不会工作，并将产生运行时错误。

:::

## The Root Element

The root element is the element that the app will be mounted to.

By default, the root element is the element with the id `root`.

You can change the root element by passing the id of the element to the second parameter of `$app`:

```ts
$app(_ => {
  // ...
}, "my-root");
```

## Multiple Application Instances

It is allowed to have multiple Refina applications on the same page.

You can just specify different root elements for different applications:

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
