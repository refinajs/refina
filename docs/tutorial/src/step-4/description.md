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

Attention: variables declared inside the view function are not states. They are just local temporary variables, which are re-created every time the view function is called.

Just like JSX, you can render components conditionally using `if` statements or other operators:

```ts
let cond = true;
let value: number | undefined;

$app.use(Basics)(_ => {
  if (cond) {
    _.h1("Hello World!");
  } else {
    _.h1("Hello Refina!");
  }

  cond && _.p("Cond is truthy.");

  value ?? _.p("Value is undefined.");
});
```

Now, try to create some states yourself, and use it to render dynamic text content for the `_.h1` in the template.
