# Creating a Refina Application

## The app Creator

Every Refina.js application starts by creating an `App` instance:

```ts
import { $app } from "refina";

$app([], _ => {
  // The main function of the app
  // ...
});
```

## Using Plugins

All the components and utility functions are provided by plugins, so it is hard to do anything without plugins.

The first parameter of `$app` can be an array of plugins:

```ts
$app([Plugin1, Plugin2(param1, param2), Plugin3], _ => {
  // ...
});
```

However, TypeScript doesn't know what plugins are used unless you declare them explicitly. So the `Plugins` interface should be declared:

```ts
declare module "refina" {
  interface Plugins {
    Plugin1: typeof Plugin1;
    Plugin2: typeof Plugin2;
    Plugin3: typeof Plugin3;
  }
}
```

In fact, components and utility functions in the Refina Core are provided via the plugin `Prelude`, which is automatically installed when you create an app.

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

By default, the root element is selected by `"#app"`.

You can change the root element by the `root` option:

```ts
$app(
  { plugins: [], root: "#my-root" },
  _ => {
    // ...
  },
  "my-root",
);
```
