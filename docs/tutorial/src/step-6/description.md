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

Try typing in the input box in the "PREVIEW" tab - you should see the text in `<p>` updating as you type.

To simplify that, there is another way to make the user input directly update a state rather than updating it manually in the event handler:

```ts
import { $app, model } from "refina";

const name = model("");

$app.use(Basics)(_ => {
  _.textInput(name);

  _.p(`Hello ${name}!`);
  // equivalent to:
  // _.p(`Hello ${name.value}!`);
});
```

The `model` function creates a `JustModel<T>` object which simply wraps an intrinsic value as an object, so that the component can get the "reference" to the value and update it directly.

As for the `textInput` component (and similar components), it takes a `Model<string>` as its first parameter, which accepts an intrinsic `string` or a `JustModel<string>` object. When user types in the input box, it updates the value of the model.

Now, try to refactor the code to use `model`. Also, when the input box is not empty, display a "clear" button to clear the input.
