# Directives in the Context Object

The directives in the context object are all named with a `$` prefix.

Directives named with a `$$` prefix are considered as internal directives, which you may not use directly in your code.

## `_.$app`

The App instance.

## `_.$state`

The current state of the App.

Can only be of type `UPDATE` or `RECV`, because there is no Context in the `IDLE` state.

## `_.$updateState` {#update-state}

If the App is in the `UPDATE` state, the value is the state, otherwise it is `null`.

**Usage**:

```ts
app(_ => {
  if (_.$updateState) {
    _.$root.addCls("dark");
  }
});
```

## `_.$recvState`

Similar to [`_.$updateState`](#update-state).

If the App is in the `RECV` state, the value is the state, otherwise it is `null`.

## `_.$update`

Call the method to trigger an `UPDATE` call.

Equivalent to `_.$app.update`.

## `_.$setD`

Set the value of a `D` object and trigger an `UPDATE` call if the value is changed.

## `_.$ev`

This directive is only available in the event handler.

**Usage**:

```ts
app(_ => {
  _.$ev; // ERROR: Property '$ev' does not exist on type 'Context'.

  if (_.button("Click me")) {
    _.$ev; // of type MouseEvent
  }
});
```

## `_.$root`

The component representing the root element of the app.

You can use this component to add classes, styles and event listeners to the root element.

## `_.$body`

The component representing the document body.

You can use this component to add classes, styles and event listeners to the document body.

## `_.$window`

The component representing the document body.

You can use this component to add event listeners to window.

## `_.$ref` {#ref}

See [Ref a Component](../essentials/component#ref-component).

and [Ref a Element](../essentials/lowlevel#ref-element).

## `_.$props` {#props}

Add extra props to the next component.

See [Extra Props](../essentials/component#extra-props).

## `_.$cls` {#cls}

Add classes to the next component or element.

See [Add Classes and Styles](../essentials/rendering-basics#add-classes-and-styles).

## `_.$css` {#css}

Add styles to the next component or element.

See [Add Classes and Styles](../essentials/rendering-basics#add-classes-and-styles).

## `_.$permanentData`

The shortcut of `_.$app.permanentData`.

**Lifetime**: from the construction of the app to the window is closed.

## `_.$runtimeData` {#runtime-data}

The shortcut of `_.$state.runtimeData`.

**Lifetime**: one `UPDATE` or `RECV` call.

:::info
It is usually a bad idea to write to `_.$runtimeData` directly,
which is not scoped to the inner content,
use `_.provide` to provide values to `_.$runtimeData` instead.
:::
