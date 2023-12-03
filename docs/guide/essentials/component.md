# Components

Components allow us to split the UI into independent and reusable pieces, and think about each piece in isolation.

## Kinds of Components

There are three kinds of components in Refina:

- **Output component**: Components only do some output. e.g. `h1`, `p`...
- **Trigger component**: Components with a event to fire. e.g. `button`, `input`...
- **Status component**: Components with a state. e.g. `checkbox`, `radio`...

:::info
The above three kinds of components are the most common use cases.

The low-level implementation of components is just a context function. So it is possible to create a kind of component that is not listed above.
:::

## Ref on Component {#ref-component}

You may want to call some methods or access some properties of a component instance. So you can use [the `_.$ref` directive](../../api/directives.md#ref) to get the component instance.

```ts
import { ref } from "refina";
import Form, { TextField } from "refina-plugin-form";

const fieldRef = ref<TextField>();

app.use(Form)(_ => {
  _.$ref(fieldRef) && _.textField("name", "Name");
  _.button("reset") && fieldRef.current?.reset();
});
```

:::info
Both the low-level DOM elements and the components can be refed by the `_.$ref` directive.
:::

:::tip The usage of `&&`
To let TypeScript check whether you are using the right type of the ref object, you'd better use the `&&` operator to connet the `_.$ref` directive and the component function.

Because the `_.$ref` directive always returns `true`, so the component function will always be called. But if the ref object is not the right type, the component function will be of type `never`, and the IDE will report an error.
:::

## Extra Props {#extra-props}

Sometimes there are many optional props for a component, and it is not convenient to write them all in the positional parameters. So we can use [the `_.$props` directive](../../api/directives.md#props) to add props to the next component as named parameters.

```ts
app.use(MdUI2)(_ => {
  _.$props({
    icon: "person",
    endIcon: "arrow_forward",
  }) && _.mdChip("Student", true);
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
