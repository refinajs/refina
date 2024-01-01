# 上下文对象中的指令

上下文对象中名称以 `$` 开头的是指令。

而名称以 `$$` 开头的指令往往在内部被使用。作为应用开发者，你可能无需使用它们。

## `_.$app`

当前的应用实例。

## `_.$state`

当前的应用状态。

它可以是 `UPDATE` 或 `RECV`。但它不能是 `IDLE`，因为这时并不存在可用的上下文对象。

## `_.$updateContext` {#update-context}

If the App is in the `UPDATE` state, the value is the context itself, otherwise it is `null`.

**使用方法**：

```ts
$app(_ => {
  if (_.$updateContext) {
    _.$root.addCls("dark");
  }
});
```

## `_.$recvContext`

Similar to [`_.$updateContext`](#update-context).

If the App is in the `RECV` state, the value is the context itself, otherwise it is `null`.

## `_.$update`

调用此方法以触发页面更新（即触发 `UPDATE` 状态的调用）。

与 `_.$app.update` 等价。

## `_.$setD`

设置一个 `D` 所包含的值，并触发页面更新。

## `_.$ev`

这个指令仅在处理事件的代码中可用。

**使用方法**：

```ts
$app(_ => {
  _.$ev; // ERROR: Property '$ev' does not exist on type 'Context'.

  if (_.button("Click me")) {
    _.$ev; // of type MouseEvent
  }
});
```

## `_.$root`

代表应用根元素的元素组件。

通过它为根元素设置类名、样式与事件侦听器。

## `_.$body`

代表 `window.document` 的元素组件。

通过它为 `document.body` 设置类名、样式与事件侦听器。

## `_.$window`

代表 `window.document` 的元素组件。

通过它为 `window` 添加事件侦听器。

## `_.$ref` {#ref}

See [Ref a Element](../essentials/lowlevel#ref-element).

## `_.$props` {#props}

为下一个组件添加额外的 prop。

See [Extra Props](../essentials/component#extra-props).

## `_.$cls` {#cls}

向下一个组件或元素添加类名。

See [Add Classes and Styles](../essentials/rendering-basics#add-classes-and-styles).

## `_.$css` {#css}

向下一个组件或元素添加样式。

See [Add Classes and Styles](../essentials/rendering-basics#add-classes-and-styles).

## `_.$permanentData`

`_.$app.permanentData` 的简写。

**生命周期**: 从页面创建到应用被关闭。

## `_.$runtimeData` {#runtime-data}

`_.$state.runtimeData` 的简写。

**生命周期**：一次 `UPDATE` 或 `RECV` 调用。

:::info
通常你不需要直接读写 `_.$runtimeData`，因为它可能会从可控的作用域泄露。请使用 `_.provide` 方法向一定范围内提供值。
:::
