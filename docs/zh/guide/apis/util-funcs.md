<script setup>
import AsyncFetchVue from "../../snippets/async-fetch.vue";
import NowVue from "../../snippets/now.vue";
</script>

# Utility Context Functions

This page introduces utility context functions in the `Prelude` plugin, which is automatically installed when you create an app.

## `_.portal`

Render content in the end of the root element.

This is usefull when you want to render a dialog or a tooltip that should not be affected by the parent element.

**Example**

```ts {4}
$app.use(Basics)(_ => {
  _.div(() => {
    _.span("Inside the div");
    _.portal(_ => _.span("Inside the portal"));
  });
  _.span("Outside the div");
});
```

**Result**

```html {6}
<div id="root">
  <div>
    <span>Inside the div</span>
  </div>
  <span>Outside the div</span>
  <span>Inside the portal</span>
</div>
```

## `_.await`

Use data from an async call when rendering.

:::tip
Use `try`/`catch` to handle errors.
:::

**Example**

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

**Result**

<AsyncFetchVue/>

## `_.documentTitle`

Set the document title.

**Example**

```ts {6}
import { d } from "refina";
const username = d("");
$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  _.documentTitle(`Hello ${username}`);
});
```

## `_.embed`

Embed a view function into the current view function.

See [Embedding Views](../essentials/view.md#embedding-views).

and [Passing Parameters](../essentials/view.md#passing-parameters).

## `_.asyncEmbed`

Embed a view that is asynchronously loaded.

**Example**

```ts
_.asyncEmbed(() => import("./myView.ts"));
```

which loads the view from `./myView.ts` asynchronously, which is useful for code splitting.

:::info
The view loaded by `_.asyncEmbed` is cached, so it will not be loaded twice.
:::

## `_.provide`

Provide a value or a object of values to [`_.$runtimeData`](./directives.md#runtime-data) for the duration of the inner content.

**Example**

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

If not specified, it is `1000`, which means the time will be updated every second.
:::

**Example**

```ts
$app.use(Basics)(_ => {
  _.p(`The current time is ${_.now(500)}`);
});
```

**Result**

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
