# The Context Object

Almost all the APIs of Refina are provided by the `Context` object.

It is used to render components, handle events, and so on.

The context object contains the following properties:

- **Component functions**: used to render components.
- **Utility functions**: used to do some useful things.
- **Directives**: some special properties and methods.

:::warning
If you want to use non-directive properties and methods, you must name the context object `_`.

Otherwise, the transformation will not work, and errors will occur at runtime.
:::

## Component functions

The only way to render components is to call the corresponding component function.

There are three types of component functions:

1. **Text node**: `_.t`.
2. **Intrinsic components**: `_._div`, `_._svgPath`, whose names are prefixed with `_`.
3. **Component functions** provided by plugins: `_.button` provided by `Basics`, `_.mdButton` provided by `mdui`, etc. Whose names don't have the `_` prefix.

## Utility functions

These functions are used to do some useful things, like controlling the rendering process, etc.

Their names also don't have the `_` prefix.

## Directives

Directives are some special properties and methods of the context object.

They are prefixed with `$`, and they are not transformed when compiling.
