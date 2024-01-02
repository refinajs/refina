<script setup>
import StaticPageVue from "snippets/static-page.vue";
</script>

# 渲染基础

Let's start by rendering a "non-interactive" page:

```ts
$app.use(Basics)(_ => {
  _.$css`color: red`;
  _.h1("Hello, Refina!");

  _.$css`border: 1px solid yellow`;
  _.div(_ => {
    _.p("This is a paragraph.");
    _.p(_ => _.img("https://picsum.photos/200/300", "placeholder"));
  });
});
```

**运行结果**

<StaticPageVue />

接下来是上面代码的解释。

### 使用简单的组件

一些简单的组件，比如 `h1` 与`img` 可以通过调用对应的组件函数直接渲染。

Parameters of the component functions are passed in a positional way, so you needn't specify the name of the parameters.

### 嵌套的组件

Most components have content, which is usually corresponding to the content of the HTML element.

You can not only pass a string or a number as the content but also pass a view function.

:::tip

When using view functions as the content of a component, it is recommended to use the arrow function syntax.

To get the best experience, you can use [Prettier](https://prettier.io/) to format your code with the `arrowParens` option set to `"avoid"`.

> If you create your project with `npm create refina@latest`, Prettier is already configured for you.

:::

:::tip

The curly braces around the view function can be omitted if the view function has only one statement.

这是因为视图函数的返回值总是会被忽略。

You can use `&&` to connect directives which always return `true` to the component function.

比如，

```ts
_.div(_ => _.$css`color: red` && _.p("This is a paragraph."));
```

与

```ts
_.div(_ => {
  _.$css`color: red`;
  _.p("This is a paragraph.");
});
```

等价。

:::

### 添加类名与样式 {#add-classes-and-styles}

使用 `_.$cls` 指令添加类名；使用 `_.$css` 指令添加样式。

添加的类名与样式将被设置在下一个渲染的组件的 [主元素](./component.md#main-element)。

:::tip

`_.$css` 与 `_.$cls` 可以连续调用多次，这些调用所添加的类名与样式将被自动合并。

:::

:::tip

`_.$css` and `_.$cls` can be used as a template tag or an ordinary function, so the following two ways are equivalent:

```ts
const color = "red";
_.$css`color: ${color}`;
_.$css("color: " + color);
```

推荐省略样式字符串结尾的分号，因为它会被自动添加。

:::
