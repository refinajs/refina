# App Hooks

Hooks are functions that are called at specific times during the app's lifecycle.

Hooks can be added when installing a plugin, or in the `UPDATE` call.

## Onetime Hooks

Onetime hooks are called only once.

Use `_.$app.pushOnetimeHook` to add a onetime hook.

Can be accessed via `_.$app.onetimeHooks`.

## Permanent Hooks

Permanent hooks won't be removed after being called.

Use `_.$app.pushPermanentHook` to add a permanent hook.

Can be accessed via `_.$app.permanentHooks`.

## `beforeMain` Hook

Called before the main function is executed, whether in `UPDATE` or `RECV` state.

:::tip
`app.runtimeData` is available in this hook.
:::

## `afterMain` Hook

Called after the main function is executed, whether in `UPDATE` or `RECV` state.

:::tip
`app.runtimeData` is available in this hook.
:::

## `beforeModifyDOM` Hook

Called after the main function is executed in `UPDATE` state, but before the DOM tree is modified and classes and styles are applied.

:::tip
`app.runtimeData` is available in this hook.
:::

## `afterModifyDOM` Hook

Called after the main function is executed in `UPDATE` state, and the DOM tree is modified and classes and styles are applied.

:::tip
`app.runtimeData` is available in this hook.
:::

## `onError` Hook

Called when an error is thrown in the main function.

:::info
A hook outputting the error to the console is added by the `Prelude` plugin.
:::
