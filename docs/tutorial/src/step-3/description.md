# Add Styles and Class Names

In the previous step, we learned how to render components using some functions in the context object, which are called **component functions**. There are also **directives** in the context object. In this step, we will learn how to use two directives: `_.$cls` and `_.$css`.

`_.$cls` is used to add class names to the next component. It can be used both as a function and a tag function:

```ts
_.$cls`foo`;
_.div();
// <div class="foo"></div>
```

`_.$css` is used to add styles to the next component. It works the same as `_.$cls`:

```ts
_.$css`color:red`;
_.div();
// <div style="color:red;"></div>
```

Also, you can use `_.$cls` and `_.$css` together, and for multiple times:

```ts
_.$cls`foo`;
_.$cls`bar`;
_.$css`color:red`;
_.div();
// <div class="foo bar" style="color:red;"></div>
```

Now let's try to add some styles and class names to the `<h1>` element on the right.
