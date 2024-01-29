<script setup>
import AsyncFetchVue from "snippets/async-fetch.vue";
import NowVue from "snippets/now.vue";
</script>

# 上下文工具函数

本页介绍了由 Refina 核心的 `Prelude` 插件提供的上下文工具函数。它们在创建应用时被自动安装。

## `_.portal`

在根元素内部的末尾渲染内容。

这在编写一个对话框（`dialog`）或提示框（`tooltip`）时尤为有用。使用该方法将元素放在根元素末尾使得这些元素不受原位置的父元素影响。

**例子**

```ts {4}
$app([Basics], _ => {
  _.div(() => {
    _.span("Inside the div");
    _.portal(_ => _.span("Inside the portal"));
  });
  _.span("Outside the div");
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

可用使用 `try`/`catch` 语句来捕获错误。

:::

**例子**

```ts {1,7}
if (_.await(() => fetch("https://example.com"))) {
  // 当 fetch 返回的 Promise 完成后，_.await 返回 true。

  _.p(_.$awaited.statusText);

  // 你可以为 _.await 提供一个唯一的 id 以区分嵌套的调用。
  _.await(() => _.$awaited.text(), "Text") && _.p(_.$awaitedText);
} else {
  // 若 fetch 返回的 Promise 还未完成，则 _.await 返回 false。

  _.p("Loading...");
}
```

**运行结果**

<AsyncFetchVue/>

## `_.documentTitle`

设置文档标题（标签页标题）。

**例子**

```ts {6}
import { model } from "refina";
const username = model("");
$app([Basics], _ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  _.documentTitle(`Hello ${username}`);
});
```

## `_.embed` {#embed}

将内容嵌入当前位置。

## `_.asyncEmbed`

在当前位置嵌入异步加载的内容。

**例子**

```ts
_.asyncEmbed(() => import("./someContent.ts"));
```

这将从 `./someContent.ts` 异步地加载内容。这对代码拆分有帮助。

:::info

通过 `_.asyncEmbed` 加载的视图会被缓存，因此加载函数至多只会被调用一次。

:::

## `_.provide`

Provide a value or an object of values to [`_.$runtimeData`](./directives.md#runtime-data) for the duration of children.

**例子**

```ts
_.provide({ username: "John" }, myView, ...viewParams);
```

等价于

```ts
_.provide("username", "John", myView, ...viewParams);
```

## `_.now`

获取当前的时间，相当于 `Date.now()`。

:::tip

你可以指定 `precisionMs` 参数，表示每过多少毫秒需要更新视图以刷新时间。

如果未指定，它是 `1000`，即每一秒会更新视图以展示最新的时间。

:::

**例子**

```ts
$app([Basics], _ => {
  _.p(`The current time is ${_.now(500)}`);
});
```

**运行结果**

<NowVue/>

## `_.setInterval`

设置一个定时器，每 `interval` 毫秒调用一次回调函数。

:::info

当这个函数不再被调用时，定时器会被自动清除。

:::

## `_.for`

参见 [列表渲染](../essentials/list)。

## `_.forTimes`

参见 [重复一定次数](../essentials/list#for-times)。
