# 钩子

钩子是在特定时机被调用的回调函数。

钩子可以在插件被安装时添加，或者在 `UPDATE` 状态下由主函数添加。

## 一次性钩子

一次性钩子在调用一次后会被删除。

调用 `_.$app.pushOnetimeHook` 以添加一次性钩子。

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
