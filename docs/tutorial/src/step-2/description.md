# Declarative Rendering

What you see in the editor is a Refina application. A Refina application is created by the `$app` function, which takes a view function as an argument. That view function is the main function of the application, which describes how the HTML should look like and what it should do based on JavaScript state.

The view function is called every time the state changes or an event should be received.

To render components, you can use the `Basics` plugin in `@refina/basic-components` package. It provides a set of basic components that you can use to build your application.

Each of the components has a corresponding function on the `_` parameter, which we call a context object. Simply calling the function will render the component:

```ts
$app.use(Basics)(_ => {
  _.h1("Hello world!");
  // <h1>Hello world!</h1>

  _.a("GitHub", "https://github.com/refinajs");
  // <a href="https://...">GitHub</a>
});
```

Some parameters of the component represent `Content`s. You can pass a string, a number or a view function to it:

```ts
$app.use(Basics)(_ => {
  _.div("Hello world!");
  // <div>Hello world!</div>

  _.div(123);
  // <div>123</div>

  _.div(_ => {
    _.span("Hello");
    _.span("world!");
  });
  // <div><span>Hello</span><span>world!</span></div>
});
```

To render a text node, you can use the `_.t` function, which can also be a tag function:

```ts
_.t("Hello world!");
_.t`Hello world!`;
```

Now, try to create an application yourself, and render some components in it.
