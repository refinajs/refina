<script setup>
import BasicInputVue from "snippets/basic-input.vue";
import InputEventVue from "snippets/input-event.vue";
</script>

# Get the Input Value

Some actions user performed on the page are handled as events, but some should be read as values.

For instance, you may want to get the value of an input element.

## Example: Get the value of an input element

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

**Result**

<BasicInputVue />

## The Model

### The `model` Function

Because there is no way to pass an intrinsic value by reference in JavaScript, we have to wrap the value in an object, and the `model` function creates a model object to wrap the value.

### Use a Property of an Object as a model

Sometimes you may want the input component to read and write a property of an object.

The function `propModel` can create a model from a property of an object:

```ts
import { fromProp } from "refina";
const user = { username: "" };
$app([Basics], _ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### The `Model` Type

The definition of `Model` is:

```ts
type Model<T> = T | JustModel<T>;
```

### The `unwrap` Function

This function can extract the value from a model.

```ts
const intrinsicValue = 1;
assert(unwrap(intrinsicValue) === 1);

const wrappedValue = model(1);
assert(unwrap(wrappedValue) === 1);
```

:::info

If the wrapped value is defined via `model` function, it is of type `JustModel<T>`, so you don't need to use `unwrap` function to extract the value. You can access `yourModel.value` directly.

:::

### The `_.$updateModel` Function

Corresponding to `unwrap` function, this function can update the value of a model.

## Another Way to Get Input Value

Sometimes you may want to get the input value and do something with it, but you don't want to store the value in a variable.

The following example stores the input value to the session storage, instead of a variable.

```ts
$app([Basics], _ => {
  _.label("Username");
  if (_.textInput(sessionStorage.getItem("username") ?? "")) {
    sessionStorage.setItem("username", _.$ev);
  }
});
```

The logic is that, if the input value is changed, the `textInput` component will emit an event, and the event data is the new value, which can be accessed via `_.$ev`.

**Result**

<InputEventVue />
