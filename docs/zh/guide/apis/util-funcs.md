<script setup>
import AsyncFetchVue from "snippets/async-fetch.vue";
import NowVue from "snippets/now.vue";
</script>

# 上下文工具函数

本页介绍了由 Refina 核心的 `Prelude` 插件提供的上下文工具函数。它们在创建应用时被自动安装。

## `_.portal`

Render content at the end of the root element.

This is useful when you want to render a dialog or a tooltip that should not be affected by the parent element.

**例子**

```ts {4}
$app.use(Basics)(_ => {
  _.div(() => {
    _.span("在 div 内部");
    _.portal(_ => _.span("在 portal 内部"));
  });
  _.span("在 div 外部");
});
```

**运行结果**

```html {6}
<div id="root">
  <div>
    <span>在 div 内部</span>
  </div>
  <span>在 div 外部</span>
  <span>在 portal 内部</span>
</div>
```

## `_.await`

在渲染时使用异步调用的返回值。

:::tip

Use `try`/`catch` to handle errors.

:::

**例子**

```ts {1,7}
if (_.await(() => fetch("https://example.com"))) {
  // When the promise is fulfilled, _.await returns true.

  _.p(_.$awaited.statusText);

  // You can also use a custom id for a nesting await call.
  _.await(() => _.$awaited.text(), "Text") && _.p(_.$awaitedText);
} else {
  // When the promise is pending, _.await returns false.

  _.p("Loading...");
}
```

**运行结果**

<AsyncFetchVue/>

## `_.documentTitle`

Set the document title.

**例子**

```ts {6}
import { d } from "refina";
const username = d("");
$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  _.documentTitle(`Hello ${username}`);
});
```

## `_.embed` {#embed}

Embed a view function into the current view function.

See [Embedding Views](../essentials/view.md#embedding-views).

and [Passing Parameters](../essentials/view.md#passing-parameters).

## `_.asyncEmbed`

Embed a view that is asynchronously loaded.

**例子**

```ts
_.asyncEmbed(() => import("./myView.ts"));
```

which loads the view from `./myView.ts` asynchronously, which is useful for code splitting.

:::info

The view loaded by `_.asyncEmbed` is cached, so it will not be loaded twice.

:::

## `_.provide`

Provide a value or an object of values to [`_.$runtimeData`](./directives.md#runtime-data) for the duration of the inner content.

**例子**

```ts
_.provide({ username: "John" }, myView, ...viewParams);
```

which is equivalent to

```ts
_.provide("username", "John", myView, ...viewParams);
```

## `_.now`

Get the current time in milliseconds.

:::tip

You need to specify the `precisionMs` parameter, which means for how many milliseconds the time will be updated.

如果未指定，它是 `1000`，即每一秒会更新视图以展示最新的时间。

:::

**例子**

```ts
$app.use(Basics)(_ => {
  _.p(`The current time is ${_.now(500)}`);
});
```

**运行结果**

<NowVue/>

## `_.setInterval`

Schedule a callback to be called every `interval` milliseconds.

:::info

The interval will be automatically cleared when it is no longer rendered.

:::

## `_.for`

See [List rendering](../essentials/list).

## `_.forTimes`

See [Render for Given Times](../essentials/list#for-times).
