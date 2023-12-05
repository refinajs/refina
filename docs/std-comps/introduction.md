# Standard Components

In this section, we will cover the standard components of Refina.

The standard components are the components that are often used and _not too simple_. It isn't guaranteed that they will be included in all component libraries. But component libraries should try its best to fit the interface of the standard components.

:::warning
Different UI libraries may have different implementations of the standard components.

Some features may not be available in some UI libraries, and some UI libraries may have additional features.
:::

:::tip
In the examples in this section, we will use the `x` prefix to import the standard components. For example, `_.xButton`.

However, in the actual code, you should use the prefix of the UI library you're using. For example, `_.mdButton` for MdUI, and `_.fButton` for FluentUI.

Components provided by the `@refina/basic-components` package don't have a prefix. For example, `_.button`.
:::

:::info
Some components that are too simple and obvious are not included in the standard components. For example, `_.span` and `_.mdIcon`.

Some components that are too specific are also not included in the standard components. For example, `_.mdAppBarTitle`.
:::
