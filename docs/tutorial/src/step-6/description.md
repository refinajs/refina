# Get User Input

Using event handlers, we can get user input and update states accordingly.

```ts
let name = "";

$app.use(Basics)(_ => {
  if (_.textInput(name)) {
    name = _.$ev;
  }
  _.p(`Hello ${name}!`);
});
```

Try typing in the input box - you should see the text in `<p>` updating as you type.

To simplify that, there is another way to make the user input directly update a state rather than updating it manually in the event handler:

```ts
import { $app, d } from "refina";

const name = d("");

$app.use(Basics)(_ => {
  _.textInput(name);
  _.p(`Hello ${name}!`);
});
```

The `d` function creates a `PD` object which simply wraps an intrinsic value as an object, so that the component can get the "reference" to the value and update it directly.

As for the `textInput` component (and similar components), it takes a `D<string>` as its first parameter, which accepts an intrinsic value or a `PD` object. When user types in the input box, it updates the value if a `PD` object is passed in.

Now, try to refactor the code to use `d`. Also, display a "clear" button when the input box is not empty.
