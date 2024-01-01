# The Context Object

Almost all the APIs of Refina.js are provided via the context object.

It is used to render components, handle events, etc.

The context object has three kinds of properties:

- **Component functions**: used to render components.
- **Utility functions**: used to do some useful things.
- **Directives**: some special properties and methods.

:::warning
If you want to use non-directive properties, you MUST name the context object as `_`.

否则，编译时转换将不会工作，并将产生运行时错误。
:::

## Component Functions

The only way to render components is to call the corresponding component function.

There are three kinds of component functions:

1. **Text node**: `_.t`.
2. **Lowlevel elements**: `_._div`, `_._svgPath`, whose names are prefixed with `_`.
3. **Component functions** provided by plugins: `_.button` provided by `Basics`, `_.mdButton` provided by `MdUI`, etc. Whose names don't have the `_` prefix.

## Utility Functions

These functions are used to do some useful things, like controlling the rendering process, set a timer, etc.

Their names also don't have the `_` prefix.

See [Utility Context Functions](/guide/apis/util-funcs.md) for utility functions provided by the Refina Core.

## Directives

Directives are some special properties and methods of the context object.

They are prefixed with `$`, and they are not transformed when compiling.

See [Directives](/guide/apis/directives.md) for directives provided by the Refina Core.
