# Handle Events

We can listen to events by checking the return value of the component function:

```ts {2-4}
$app([Basics], _ => {
  if (_.button("Click me!")) {
    console.log("Clicked!", _.$ev);
  }
});
```

Only when the button is clicked, the corresponding `_.button` call will return `true`, and statements inside the `if` block will be executed. These statements are the event handler.

`_.$ev` is the event data. As for `_.button`, it is a `MouseEvent` object. `_.$ev` can only be used inside the event handler.

You can update states inside the event handler:

```ts {4}
let click = false;

$app([Basics], _ => {
  _.button("Click me!") && (clicked = true);
  clicked && _.p("Clicked!");
});
```

<!--

:::warning Do not update states outside the event handler.

The following code will cause undefined behavior:

```ts
let n = 0;
$app(_ => {
  n++;
});
```

`n` will be incremented every time the fragment is called, which is not predictable.

:::

-->

After the events are handled, Refina will re-render the application automatically.

Now, try to implement a counter yourself which counts the number of clicks on the button.
