<script setup>
import AsyncFetchVue from "../components/async-fetch.r.vue";
import NowVue from "../components/now.r.vue";
</script>

# Utility Context Functions

The utility context functions are a set of functions that defined in the `Prelude` plugin, which is automatically installed when you create an app.

They provide some useful features.

## `_.portal`

Render content to the end of the root element.

This is usefull when you want to render a dialog or a tooltip that should not be affected by the parent element's styles.

**example**

```ts {4}
app.use(Basics)(_ => {
  _.div(() => {
    _.span("Inside the div");
    _.portal(_ => _.span("Inside the portal"));
  });
  _.span("Outside the div");
});
```

**result**

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

:::warning
**DO NOT** change the Ikey of the await call, or the data will be lost, and a new async call will be made.
:::

:::tip
Use `try`/`catch` to handle errors.
:::

**example**

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

**result**

<AsyncFetchVue/>

## `_.documentTitle`

Set the document title.

**example**

```ts {6}
import { d } from "refina";
const username = d("");
app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  _.documentTitle(`Hello ${username}`);
});
```

## `_.embed`

Embed a view function into the current view function.

See [Embedding Views](../guide/essentials/view.md#embedding-views).

and [Passing Parameters](../guide/essentials/view.md#passing-parameters).

## `_.asyncEmbed`

Embed a view that is asynchronously loaded.

**example**

```ts
_.asyncEmbed(() => import("./myView.r.ts"));
```

which loads the view from `./myView.r.ts` asynchronously, which is useful for code splitting.

:::info
The view loaded by `_.asyncEmbed` is cached, so it will not be loaded twice.
:::

## `_.provide`

Provide a value or a object of values to [`_.$runtimeData`](./directives.md#runtime-data) for the duration of the inner content.

**example**

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

**example**

```ts
app.use(Basics)(_ => {
  _.p(`The current time is ${_.now(500)}`);
});
```

**result**

<NowVue/>

## `_.setInterval`

Schedule a callback to be called every `interval` milliseconds.

:::info
The interval will be automatically cleared when it is no longer rendered.
:::

## `_.for`

See [List rendering](../guide/essentials/list).

## `_.forTimes`

See [Render for Given Times](../guide/essentials/list#for-times).