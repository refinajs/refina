<script setup>
import BasicInputVue from "snippets/basic-input.vue";
import InputEventVue from "snippets/input-event.vue";
</script>

# 获取用户输入

用户的一些操作可以作为事件被处理，而另一些可能需要获取输入值。

比如，你可能想要获取用户在 input 元素中的输入。

## 例子：获取用户在 input 元素中的输入。

```ts
import { model } from "refina";

const username = model("");

$app([Basics], _ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  username.value.length && _.button("Clear") && (username.value = "");
  _.p(`Your username is: ${username.value}`);
});
```

**运行结果**

<BasicInputVue />

## Model 对象

### `model` 函数

因为在 JavaScript 中没有办法直接引用原始值，我们需要将原始值包裹在一个对象中来实现引用的效果。`d` 函数即是通过创建一个类型为 **`PD`** 的对象来包裹原始值。

### 将对象的属性转化为一个 model

你可能想要将输入框的值读/写到一个对象的某个属性。

`fromModel` 函数可以将对象的属性转化为一个 model。

```ts
import { fromProp } from "refina";
const user = { username: "" };
$app([Basics], _ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### `D` 类型

`D` 的定义是：

```ts
type D<T> = T | PD<T>;
```

### The `unwrap` Function

该函数可以从类型为 `Model` 的值中取出原始值。

```ts
const intrinsicValue = 1;
assert(unwrap(intrinsicValue) === 1);

const wrappedValue = model(1);
assert(unwrap(wrappedValue) === 1);
```

:::info

If the wrapped value is defined via `model` function, it is of type `JustModel<T>`, so you don't need to use `unwrap` function to extract the value. 你可以直接访问 `yourModel.value`.

:::

### `_.$setD` 函数

Corresponding to `unwrap` function, this function can update the value of a model.

## 另一种获取用户输入的方式。

有时你可能需要对用户的输入进行一些操作，但是又不想将输入的值存储在一个变量中。

下面的例子中，用户的输入被存储在 `sessionStorage`，而不是一个变量。

```ts
$app([Basics], _ => {
  _.label("Username");
  if (_.textInput(sessionStorage.getItem("username") ?? "")) {
    sessionStorage.setItem("username", _.$ev);
  }
});
```

这里的逻辑是，当用户输入时，`textInput` 组件会触发事件，并以用户新输入的值作为事件的数据。

**运行结果**

<InputEventVue />
