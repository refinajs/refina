<script setup>
import BasicInputVue from "../../snippets/basic-input.vue";
import InputEventVue from "../../snippets/input-event.vue";
</script>

# Get the Input Value

Some actions user performed on the page are handled as events, but some should be read as values.

For instance, you may want to get the value of an input element.

## Example: Get the value of an input element

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

**Result**

<BasicInputVue />

## The Data Wrapper

### The `d` Function

Because there is no way to pass an intrinsic value by reference in JavaScript, we have to wrap the value in an object, and the `d` function creates an object of **type `PD`** to wrap the value.

### Use a Property of an Object as `PD`

Sometimes you may want the input component to read and write a property of an object.

The function `fromProp` can create a `PD` object from a property of an object:

```ts
import { fromProp } from "refina";
const user = { username: "" };
$app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### The `D` Type

The definition of `D` is:

```ts
type D<T> = T | PD<T>;
```

Most of the params of Refina components are of type `D<...>`, which means you can pass just the intrinsic value or a `PD` object to the param.

### The `getD` Function

This function can extract the value from a `D` object.

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

**Result**

<InputEventVue />
