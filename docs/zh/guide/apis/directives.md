# 上下文对象中的指令

上下文对象中名称以 `$` 开头的是指令。

而名称以 `$$` 开头的指令往往在内部被使用。作为应用开发者，你可能无需使用它们。

## `_.$app`

当前的应用实例。

## `_.$state`

当前的应用状态。

它可以是 `UPDATE` 或 `RECV`。但它不能是 `IDLE`，因为这时并不存在可用的上下文对象。

## `_.$updateContext` {#update-context}

如果应用处于 `UPDATE` 状态，那么它是当前上下文对象，否则它是 `null`。

**使用方法**：

```ts
$app([], _ => {
  if (_.$updateContext) {
    _.$root.addCls("dark");
  }
});
```

## `_.$recvContext`

与 [`_.$updateContext`](#update-context) 类似。

如果应用处于 `RECV` 状态，那么它是当前上下文对象，否则它是 `null`。

## `_.$updateModel`

设置一个 `Model` 所包含的值，并触发页面更新。

## `_.$ev`

这个指令仅在处理事件的代码中可用。

**使用方法**：

```ts
$app([], _ => {
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

参见 [元素引用](../essentials/lowlevel#ref-element)。

## `_.$props` {#props}

为下一个组件添加额外的 prop。

参见 [额外的 prop](../essentials/component#extra-props)。

## `_.$cls` {#cls}

向下一个组件或元素添加类名。

参见 [添加类名与样式](../essentials/rendering-basics#add-classes-and-styles).

## `_.$css` {#css}

向下一个组件或元素添加样式。

参见 [添加类名与样式](../essentials/rendering-basics#add-classes-and-styles).

## `_.$runtimeData` {#runtime-data}

`_.$state.runtimeData` 的简写。

**生命周期**：一次 `UPDATE` 或 `RECV` 调用。

:::info

It is usually a bad idea to write to `_.$runtimeData` directly,
which is not scoped to children,
use `_.provide` to provide values to `_.$runtimeData` instead.

:::
