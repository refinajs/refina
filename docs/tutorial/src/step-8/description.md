# Views

A view is a function that renders a part of the page.

It is used to split the page into multiple parts, which can be rendered separately, and reused.

To define a view in Refina, you can use the `$view` function:

```ts
import { $view, _ } from "refina";

export default $view((id: number) => {
  _.h1(`Card ${id}`);
});
```

To use a view, just call the context object:

```ts
import { $app } from "refina";
import CardView from "./CardView";

$app(_ => {
  _(CardView)("1");
  _(CardView)("2");
  _(CardView)("3");
});
```

Now, let's try to use views to extract the duplicated code into a view, and use the view to render the content.
