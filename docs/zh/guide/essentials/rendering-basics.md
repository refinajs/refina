<script setup>
import StaticPageVue from "snippets/static-page.vue";
</script>

# 渲染基础

首先我们来构建一个简单的“非交互”页面：

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

组件的参数按位置传入，因此你不需要指定参数的名称。

### 嵌套的组件

许多组件都有一个或多个内容。它们对应渲染的 HTML 的一部分。

你不但可以将字符串或数字作为内容传入，也可以使用视图函数。

:::tip

当使用视图函数作为组件的内容时，推荐使用箭头函数。

为了获取最佳的开发体验，你可以使用 [Prettier](https://prettier.io/) 来格式化代码，并将 `arrowParens` 设置为 `"avoid"`。

> 如果你通过 `npm create refina@latest` 创建应用，勾选使用 Prettier 即可。

:::

:::tip

如果视图函数只有一个语句，那么箭头函数的花括号可以省略。

这是因为视图函数的返回值总是会被忽略。

你也可以使用 `&&` 来将数个一定返回真值的语句和最后一个语句连接，将多个语句转换为表达式，并省去花括号。

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

`_.$css` 与 `_.$cls` 指令均可以作为模板字符串标签或普通的函数使用。因此以下两种写法等价。

```ts
const color = "red";
_.$css`color: ${color}`;
_.$css("color: " + color);
```

推荐省略样式字符串结尾的分号，因为它会被自动添加。

:::
