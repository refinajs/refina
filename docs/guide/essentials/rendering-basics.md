<script setup>
import StaticPageVue from "snippets/static-page.vue";
</script>

# Rendering Basics

Let's start by rendering a "non-interactive" page:

```ts
$app([Basics], _ => {
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

### Simple Components

Some simple components like `h1` and `img` can be rendered by calling the corresponding component function.

Parameters of the component functions are passed in a positional way, so you needn't specify the name of the parameters.

### Nested Components

Most components have content, which is usually corresponding to the content of the HTML element.

You can not only pass a string or a number as the content but also pass a fragment.

:::tip

When using fragments as the content of a component, it is recommended to use the arrow function syntax.

To get the best experience, you can use [Prettier](https://prettier.io/) to format your code with the `arrowParens` option set to `"avoid"`.

> If you create your project with `npm create refina@latest`, Prettier is already configured for you.

:::

:::tip

The curly braces around the fragment can be omitted if the fragment has only one statement.

This is because the return value of the fragment will always be ignored.

You can use `&&` to connect directives which always return `true` to the component function.

For example,

```ts
_.div(_ => _.$css`color: red` && _.p("This is a paragraph."));
```

and

```ts
_.div(_ => {
  _.$css`color: red`;
  _.p("This is a paragraph.");
});
```

are equivalent.

:::

### Add Classes and Styles {#add-classes-and-styles}

You can use the `_.$cls` directive to add classes to the next component, and `_.$css` to add styles.

The styles and classes will be applied to the [primary element](./component.md#primary-element) of the following component.

:::tip

`_.$css` and `_.$cls` can be called multiple times in a row, and the styles and classes will be merged.

:::

:::tip

`_.$css` and `_.$cls` can be used as a template tag or an ordinary function, so the following two ways are equivalent:

```ts
const color = "red";
_.$css`color: ${color}`;
_.$css("color: " + color);
```

It is recommended to omit the semicolon at the end of the CSS text, which will be automatically added.

:::
