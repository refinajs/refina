# Creating a Refina Application

## The app Creator

Every Refina.js application starts by creating an `App` instance:

```ts
import { $app } from "refina";

$app(_ => {
  // The main function of the app
  // ...
});
```

## Using Plugins

Call `$app.use` to install plugin to the app.

All the components and utility functions are provided by plugins, so it is hard to do anything without plugins.

```ts
import { $app } from "refina";
import Basics from "@refina/basic-components";

$app.use(Basics)(_ => {
  // _.h1 is provided by the Basics plugin
  _.h1("Hello, Refina!");
});
```

To use multiple plugins, just call `$app.use` in a chain:

```ts
$app.use(Plugin1).use(Plugin2, param1, param2).use(Plugin3)(_ => {
  // ...
});
```

In fact, components and utility functions in the Refina Core are provided via the plugin `Prelude`, which is automatically installed when you create an app.

:::warning

Because of the limitations of TypeScript, the component functions provided by plugins that are imported but not installed are still visible in the context object in the IDE. But a runtime error will occur if you use them.

:::

## The Main Function

The main function is where you construct the page and handle events.

Not only `App`, but also `View` and `Component` have a main function.

The first parameter of the main function is a `Context` object, which is used to do almost everything like rendering components, handling events, etc.

:::warning

You can only name the first param of the main function (the context object) as `_`.

Otherwise, the transformation will not work, and errors will occur at runtime.

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
