<script setup>
import StaticPageVue from "../../components/static-page.r.vue";
</script>

# Rendering Basics

Let's start by rendering a "static" page, which means the page doesn't have any dynamic content.

```ts
app.use(Basics)(_ => {
  _.$css`color: red`;
  _.h1("Hello, Refina!");

  _.$css`border: 1px solid yellow`;
  _.div(_ => {
    _.p("This is a paragraph.");
    _.p(_ => _.img("https://picsum.photos/200/300", "placeholder"));
  });
});
```

**Result**

<StaticPageVue />

Now let's explain the code above.

### Simple components

Some simple components like `h1` and `img` can be rendered by calling the corresponding component function.

Parameters of the component functions are passed in the positional way, so you needn't to specify the name of the parameters.

### Nested components

Most components have a content, which is usually corresponding to the content of the HTML element.

You can not only pass a string or a number as the content, but also pass a view function.

:::warning
When using view functions as the content of a component, you should use the context object passed in the view function in the innermost scope, instead of using the context object in the outer scope.
:::

:::tip
When using view functions as the content of a component, it is recommended to use the arrow function syntax.

To get the best experience, you can [use Prettier to format your code](../quick-start#use-prettier).
:::

:::tip
The curly braces around the view function can be omitted if the view function has only one statement.

This is because the return value of the view function will be ignores.

And you can use `&&` to connect directives which always returns `true` with the component function.

For example, the following two ways are equivalent:

```ts
_.div(_ => _.$css`color: red` && _.p("This is a paragraph."));
```

```ts
_.div(_ => {
  _.$css`color: red`;
  _.p("This is a paragraph.");
});
```

:::

### Add styles

You can use the `_.$css` directive to add styles to the next component, and `_.$cls` to add classes.

The styles and classes will be applied to the "main element" of the following component.

:::tip
`_.$css` and `_.$cls` can be called multiple times in a row, and the styles and classes will be merged.
:::

:::tip
`_.$css` and `_.$cls` can be used as a template tag or a ordinary function, so the following two ways are equivalent:

```ts
const color = "red";
_.$css`color: ${color}`;
_.$css("color: " + color);
```

And it is recommended to omit the semicolon at the end of the style string, which will be automatically added.
:::
