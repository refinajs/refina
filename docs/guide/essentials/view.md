# View

A view is a function that renders a part of the page.

It is mostly used to render a part of the page one or few times or as the content of a page for multi-page applications.

## Usage

**myView.ts**

```ts
import { $view } from "refina";

export default $view(_ => {
  _.span("my view");
});
```

**app.ts**

```ts
import MyView from "./MyView.ts";

$app(_ => {
  _(MyView)();
  _.div(MyView.$func);
});
```

**rendered HTML**

```html
<div>
  <span>my view</span>
</div>
<span>my view</span>
```

## The `$view` API

The `$view` API is used to define a view.

It is recommended to define a view in a separate file and export it as a default export.

## Passing Parameters {#passing-parameters}

A view can have parameters:

```ts
import { $view, _ } from "refina";

export default $view((name: string, id?: number) => {
  _.p(_ => {
    _.t`My name is ${name}. `;
    id !== undefined && _.t(`My ID is ${id}.`);
  });
});
```

Then, you can pass the parameters to the view:

```ts
_(MyView)("John", 123);
_(MyView)("Mary");
```

## View with States

A view can have states, but the states are shared between all the instances of the view.

```ts
let count = 0;

export default $view(_ => {
  _.p(`Count is: ${count}`);
  _.button(`Add`) && count++;
});
```

:::warning

Since the states are shared between all the instances of the view, you SHOULD be careful when using states in a view.

:::

## Differences between View and Component {#view-vs-component}

Views can be regarded as a simplified version of a component.

The major differences are:

- Components are registered as context functions, while views are just normal functions.
- Each component instance has its own states, while all the instances of a view share the same states.
- A component has a [`$primaryEl` property](./component.md#primary-element), and classes and styles can be added to it, while a view has no such property.
- A component can be refed by the [`_.$ref`](../apis/directives.md#ref) directive, while a view can't because a view has no instance.
- A component has [extra props](./component.md#extra-props), while a view only has parameters.

### How to Choose

If you want to reuse a **fragment of the page**, you should use a _view_.

If you want to reuse a **part of code with its own states**, you should use a _component_.

If you are a **UI library** author, you should always provide _components_.
