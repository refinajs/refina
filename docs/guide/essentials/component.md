# Components

Components allow us to split the UI into independent and reusable pieces, and think about each piece in isolation.

Unlike components in Vue.js, where components are also used to split the app into several parts, it is preferred to use [view](./view.md) to split the app in Refina.

## Kinds of Components

There are three kinds of components in Refina:

- **Output component**: Components only do some output. e.g. `h1`, `p`...
- **Trigger component**: Components with a event to fire. e.g. `button`, `input`...
- **Status component**: Components with a state. e.g. `checkbox`, `radio`...

:::info

The above three kinds of components are the most common use cases.

The low-level implementation of components is just a context function. So it is possible to create a kind of component that is not of any kind listed above.

:::

## Extra Props {#extra-props}

Sometimes there are many optional props for a component, and it is not convenient to write them all in the positional parameters. So we can use [the `_.$props` directive](../apis/directives.md#props) to add props to the next component as named parameters.

```ts
$app.use(MdUI)(_ => {
  _.$props({
    icon: "person",
    endIcon: "arrow_forward",
  });
  _.mdChip("Student", true);
});
```

:::info

ALL the extra props are **optional**.

:::

:::info

The props as parameters are declared in the different way by the component from the extra props.

So you can't pass an extra prop as a parameter to the component, and vice versa.

:::

## The Main Element {#main-element}

If the component renders a DOM element (text node is excluded), it has a main element, which can be assessed via `componentInstance.$mainEl`.

If the component doesn't render any DOM element, its main element is `undefined`.

The main element should be the most important element in the component. And classes and styles applied to the component will be applied to the main element.

A component can specify the main element by calling `this.$main()`. If not specified, the first element will be the main element.

:::info

Elements rendered via low-level rendering functions also have a main element, which is always the element itself.

:::
