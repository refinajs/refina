# List Rendering

We can use the `_.for` component to render a list of elements based on a source array:

```ts
const todos = [
  { id: 1, text: "Buy milk" },
  { id: 2, text: "Do homework" },
  { id: 3, text: "Read a book" },
];

$app.use(Basics)(_ => {
  _.for(todos, "id", item => {
    _.p(item.text);
  });
});
```

Notice how we are also giving each todo object a unique id via the second parameter of `_.for`. The key allows Refina to accurately move each `<p>` to match the position of its corresponding object in the array.

The key can be an object key of each item in the list, or a function that returns a unique key for each item. `bySelf` and `byIndex` are two built-in functions that can be used as the key.

Some components have the same effect as `_.for`, e.g. `_.ul` and `_.ol`.

Now, let's finish the todo manager.
