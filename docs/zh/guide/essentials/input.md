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

$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(username, false, "edit me");
  username.value.length && _.button("Clear") && (username.value = "");
  _.p(`Your username is: ${username.value}`);
});
```

**运行结果**

<BasicInputVue />

## The Model

### The `model` Function

Because there is no way to pass an intrinsic value by reference in JavaScript, we have to wrap the value in an object, and the `model` function creates a model object to wrap the value.

### Use a Property of an Object as a model

你可能想要将输入框的值读/写到一个对象的某个属性。

The function `propModel` can create a model from a property of an object:

```ts
import { fromProp } from "refina";
const user = { username: "" };
$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### The `Model` Type

The definition of `Model` is:

```ts
type Model<T> = T | JustModel<T>;
```

### The `valueOf` Function

This function can extract the value from a model.

```ts
const intrinsicValue = 1;
assert(valueOf(intrinsicValue) === 1);

const wrappedValue = model(1);
assert(valueOf(wrappedValue) === 1);
```

:::info

If the wrapped value is defined via `model` function, it is of type `JustModel<T>`, so you don't need to use `valueOf` function to extract the value. You can access `yourModel.value` directly.

:::

### The `_.$updateModel` Function

Corresponding to `valueOf` function, this function can update the value of a model.

## 另一种获取用户输入的方式。

有时你可能需要对用户的输入进行一些操作，但是又不想将输入的值存储在一个变量中。

下面的例子中，用户的输入被存储在 `sessionStorage`，而不是一个变量。

```ts
$app.use(Basics)(_ => {
  _.label("Username");
  if (_.textInput(sessionStorage.getItem("username") ?? "")) {
    sessionStorage.setItem("username", _.$ev);
  }
});
```

这里的逻辑是，当用户输入时，`textInput` 组件会触发事件，并以用户新输入的值作为事件的数据。

**运行结果**

<InputEventVue />
