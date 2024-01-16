# Using States

States in Refina are just plain JavaScript values. You can use them to store data and render dynamic content.

```ts
let message = "Hello World!";
let person = {
  id: 1,
  name: "John Doe",
};

$app.use(Basics)(_ => {
  _.h1(message);
  _.p(`Hello ${person.name}!`);
});
```

:::warning States should be declared outside the view function.

Variables declared inside the view function are not states. They are just local temporary variables, which are re-created every time the view function is called.

:::

Just like in JSX, you can render components conditionally using `if` statements or other operators:

```ts
let cond = true;
let value: number | null | undefined;

$app.use(Basics)(_ => {
  if (cond) {
    _.h1("Hello World!");
  } else {
    _.h1("Hello Refina!");
  }

  cond && _.p("cond is truthy.");
  value === 1 && _.p("value is 1.");
  value ?? _.p("value is null or undefined.");
});
```

Now, try to create a "count" state yourself, and use it to render the content of `_.p`.
