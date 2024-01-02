<script setup>
import BasicInputVue from "snippets/basic-input.vue";
import InputEventVue from "snippets/input-event.vue";
</script>

# 获取用户输入

用户的一些操作可以作为事件被处理，而另一些可能需要获取输入值。

比如，你可能想要获取用户在 input 元素中的输入。

## 例子：获取用户在 input 元素中的输入。

```ts
import { d } from "refina";

const username = d("");

$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  username.value.length && _.button("Clear") && (username.value = "");
  _.p(`Your username is: ${username.value}`);
});
```

**运行结果**

<BasicInputVue />

## 数据包裹

### `d` 函数

因为在 JavaScript 中没有办法直接引用原始值，我们需要将原始值包裹在一个对象中来实现引用的效果。`d` 函数即是通过创建一个类型为 **`PD`** 的对象来包裹原始值。

### 将对象的属性转化为 `PD`

你可能想要将输入框的值读/写到一个对象的某个属性。

`fromProp` 函数可以将对象的属性转化为一个 `PD`。

```ts
import { fromProp } from "refina";
const user = { username: "" };
$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### `D` 类型

`D` 的定义是：

```ts
type D<T> = T | PD<T>;
```

大部分 Refina 组件的参数都是 `D<...>` 类型的。因此你可以传入原始值或其被包裹形成的`PD`对象作为参数传入。

### `getD` 函数

该函数可以从类型为 `D` 的值中取出原始值。

```ts
const intrinsicValue = 1;
assert(getD(intrinsicValue) === 1);

const wrappedValue = d(1);
assert(getD(wrappedValue) === 1);
```

:::info

If the wrapped value is defined via `d` function, it is of type `PD<T>`, so you don't need to use `getD` function to extract the value. You can access `wrappedValue.value` directly.

:::

### The `_.$setD` Function

Corresponding to `getD` function, this function can set the value of a `D` object.

:::info

There isn't a `setD` function, because a context should be provided to trigger an `UPDATE` call after the value is set.

:::

## Another Way to Get Input Value

Sometimes you may want to get the input value and do something with it, but you don't want to store the value in a variable.

The following example stores the input value to the session storage, instead of a variable.

```ts
$app.use(Basics)(_ => {
  _.label("Username");
  if (_.textInput(sessionStorage.getItem("username") ?? "")) {
    sessionStorage.setItem("username", _.$ev);
  }
});
```

The logic is that, if the input value is changed, the `textInput` component will emit an event, and the event data is the new value, which can be accessed via `_.$ev`.

**运行结果**

<InputEventVue />
