# 声明式渲染

你在编辑器中看到的是一个 Refina 应用。 A Refina application is created by the `$app` function, which takes `option` and a "main function" as its arguments. The `option` can be an array of plugins, and the main function describes how the HTML should look like and what it should do based on JavaScript state.

The main function is called every time the state changes or an event should be received.

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

TypeScript doesn't know what plugins are used unless you declare them explicitly. So the `Plugins` interface should be declared:

```ts
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
```

组件的一些参数代表“内容”（子元素）。 You can pass a string, a number or a function (we call it "fragment") to it:

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
