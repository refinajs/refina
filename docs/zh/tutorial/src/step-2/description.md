# 声明式渲染

你在编辑器中看到的是一个 Refina 应用。 Refina 应用通过 `$app` 函数创建，其第一个参数是创建应用的选项，第二个参数是主函数。 创建应用的选项可以是插件列表，主函数则根据 JavaScript 的状态来描述 HTML 应该是什么样子、要做什么事情。

每当接收事件和更新视图时，应用的主函数都会被调用。

此处安装了 `@refina/basic-components` 包的 `Basics` 插件， 它提供了一系列简单的组件，帮助你快速构建页面。

每个组件在视图函数的第一个参数上有一个对应的组件函数。这个参数是上下文对象，它必须被命名为 `_`。 简单地调用组件函数会渲染组件。

```ts
$app([Basics], _ => {
  _.h1("Hello world!");
  // <h1>Hello world!</h1>

  _.a("GitHub", "https://github.com/refinajs");
  // <a href="https://...">GitHub</a>
});
```

TypeScript 并不知道有哪些插件被使用，除非显式地声明它们 ：

```ts
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
```

组件的一些参数代表“内容”（子元素）。 You can pass a string, a number or a function (we call it "view function") to it:

```ts
$app([Basics], _ => {
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
