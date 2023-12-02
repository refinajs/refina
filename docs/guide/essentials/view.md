# View

A view is a function that renders a part of the page.

It can be seen as a simplified version of a component, which has no context function and event handler.

It is mostly used to render a part of the page for one or few times, or as the content of a page for multi-page applications.

## Usage

**myView.r.ts**

```ts
import { view } from "refina";

export default view(_ => {
  _.span("my view");
});
```

**app.r.ts**

```ts
import myView from "./myView.r.ts";

app(_ => {
  _.div(myView);
  _.embed(myView);
});
```

**rendered HTML**

```html
<div>
  <span>my view</span>
</div>
<span>my view</span>
```

## The `view` API

The `view` API provided by Refina is a helper which should provide intellisense without the need for type annotations.

It is recommended to define a view in a separate file, and export it as a default export.

## Embedding views

If a view has no parameters, you can use it directly as the content of a component.

If you want to embed the view, instead of using it as the whole content of a component, you can use the `embed` component function.

:::info
If you are sure you will only use the view for one time, you can just call the view function directly:

```ts
_.div(_ => {
  _.span("my view");
  myView(_);
});
```

However, this is not recommended for consistency.
:::

## Passing parameters

A view function can have parameters. You can decalre the parameters in the simple way:

```ts
export default view((_, name: string, id?: number) => {
  _.p(_ => {
    _.t`My name is ${name}. `;
    id !== undefined && _.t(`My ID is ${id}.`);
  });
});
```

Then, you can pass the parameters to the view function:

```ts
_.embed(myView, "John", 123);
_.embed(myView, "Mary");
```

## View with states

A view can have states, but the states is shared between all the instances of the view.

```ts
let count = 0;

export default view(_ => {
  _.p(`Count is: ${count}`);
  _.button(`Add`) && count++;
});
```

:::warning
Since the states is shared between all the instances of the view, you SHOULD be careful when using states in a view.
:::
