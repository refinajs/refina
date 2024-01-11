# Listen to Events

We can listen to events by checking the return value of the component function:

```ts {2-4}
$app.use(Basics)(_ => {
  if (_.button("Click me!")) {
    console.log("Clicked!", _.$ev);
  }
});
```

Statements inside the `if` block will only be executed when the button is clicked. These statements are called the event handler.

`_.$ev` is the event data. In the example above, it is a `MouseEvent` object. `_.$ev` can only be used inside the event handler.

You can update states inside the event handler:

```ts {4}
let click = false;

$app.use(Basics)(_ => {
  _.button("Click me!") && (clicked = true);
  clicked && _.p("Clicked!");
});
```

After the events are handled, Refina will re-render the application automatically.

Now, try to implement a counter yourself that counts the number of clicks on the button.
