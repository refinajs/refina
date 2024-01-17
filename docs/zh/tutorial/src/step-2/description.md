# 声明式渲染

你在编辑器中看到的是一个 Refina 应用。 Refina 应用通过 `$app` 函数创建，其参数是一个视图函数。 这个视图函数就是应用的主函数，它根据 JavaScript 的状态来描述 HTML 应该是什么样子、要做什么事情。

每当接收事件和更新视图时，应用的主函数都会被调用。

此处安装了 `@refina/basic-components` 包的 `Basics` 插件， 它提供了一系列简单的组件，帮助你快速构建页面。

每个组件在视图函数的第一个参数上有一个对应的组件函数。这个参数是上下文对象，它必须被命名为 `_`。 简单地调用组件函数会渲染组件。

```ts
$app.use(Basics)(_ => {
  _.h1("Hello world!");
  // <h1>Hello world!</h1>

  _.a("GitHub", "https://github.com/refinajs");
  // <a href="https://...">GitHub</a>
});
```

组件的一些参数代表“内容”（子元素）。 你可以向它们传入字符串、数字或者是视图函数。

```ts
$app.use(Basics)(_ => {
  _.div("Hello world!");
  // <div>Hello world!</div>

  _.div(123);
  // <div>123</div>

  _.div(_ => {
    _.span("Hello");
    _.span("world!");
  });
  // <div><span>Hello</span><span>world!</span></div>
});
```

你还可以使用 `_.t` 函数来渲染一个文本节点。`_.t` 也可以作为标签函数使用：

```ts
_.t("Hello world!");
_.t`Hello world!`;
```

现在，试着自己创建一个应用，并渲染一些组件。
