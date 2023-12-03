<script setup>
import BasicInputVue from "../../components/basic-input.r.vue";
import InputEventVue from "../../components/input-event.r.vue";
</script>

# Get the Input Value

Some actions user performed on the page is handled as a event, but some should be read as a value.

For instance, you may want to get the value of a input element.

## Example: Get the value of a input element

```ts
import { d } from "refina";

const username = d("");

app.use(Basics)(_ => {
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

The `d` function creates an object which has a `value` property to wrap the value.

Because there is no way to pass an intrinsic value by reference in JavaScript, we have to wrap the value in an object.

The object created by `d` function is of **type `PD`**.

### Use a Property of an Object as `PD`

Sometimes you may want the input component to read and write a property of an object.

The function `fromProp` can create a `PD` object from a property of an object:

```ts
import { fromProp } from "refina";
const user = { username: "" };
app.use(Basics)(_ => {
  _.label("Username");
  _.textInput(fromProp(user, "username")); // [!code focus]
});
```

### The `D` Type

The declaration of `D` type is:

```ts
type D<T> = T | PD<T>;
```

As you can see, most of the params of Refina components are of type `D<...>`.

That means you can pass a value or a `PD` object to the param, or just pass the intrinsic value.

### The `getD` Function

This function can extract the value from a `D` object.

```ts
const intrinsicValue = 1;
assert(getD(intrinsicValue) === 1);

const wrappedValue = d(1);
assert(getD(wrappedValue) === 1);
```

:::info
If the wrapped value is defined via `d` function, it is of type `PD<T>`, so you don't need to use `getD` function to extract the value.

You can access `wrappedValue.value` directly.
:::

### The `_.$setD` Function

Corresponding to `getD` function, this function can set the value of a `D` object.

It is only used when developing Refina components, which is out of the scope of this section.

## Another Way to Get Input Value

Sometimes you may want to get the input value and do something with it, but you don't want to store the value in a variable.

The following example stores the input value to the session storage, instead of a variable.

```ts
app.use(Basics)(_ => {
  _.label("Username");
  if (_.textInput(sessionStorage.getItem("username") ?? "")) {
    sessionStorage.setItem("username", _.$ev);
  }
});
```

The logic is that, if the input value is changed, the `textInput` component will emit an event, and the event data is the new value, which can be accessed via `_.$ev`.

**Result**

<InputEventVue />
