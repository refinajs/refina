# 钩子

钩子是在特定时机被调用的回调函数。

钩子可以在插件被安装时添加，或者在 `UPDATE` 状态下由主函数添加。

## 一次性钩子

一次性钩子在调用一次后会被移除。

调用 `_.$app.pushOnetimeHook` 以添加一次性钩子。

一次性钩子可以通过 `_.$app.onetimeHooks` 访问。

## 永久钩子

永久钩子在被调用后不会被移除。

调用 `_.$app.pushPermanentHook` 以添加永久钩子。

永久钩子可以通过 `_.$app.permanentHooks` 访问。

## `beforeMain` 钩子

在应用的主函数被调用之前调用，无论处于 `UPDATE` 或 `RECV` 状态下。

:::tip

`app.runtimeData` 在此钩子中可用。

:::

## `afterMain` 钩子

在应用的主函数被调用之后调用，无论处于 `UPDATE` 或 `RECV` 状态下。

:::tip

`app.runtimeData` 在此钩子中可用。

:::

## `beforeModifyDOM` 钩子

在应用主函数在 `UPDATE` 状态下的调用完成后、在更新 DOM 的树结构、设置类名与样式之前调用。

:::tip

`app.runtimeData` 在此钩子中可用。

:::

## `afterModifyDOM` 钩子

在应用主函数在 `UPDATE` 状态下的调用完成并且完成更新 DOM 的树结构、设置类名与样式之后调用。

:::tip

`app.runtimeData` 在此钩子中可用。

:::

## `onError` 钩子

当主函数运行时抛出未捕获的错误时调用。

:::info

一个将错误输出至控制台的钩子已经由 `Prelude` 插件自动添加。

:::
