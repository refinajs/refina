<script setup>   
import EventHandling from "../../snippets/event-handling.r.vue";
</script>

# Handle Events

In this section, we will learn how to handle events in Refina.

```ts
let count = 0;

app.use(Basics)(_ => {
  _.p(`Count is: ${count}`);

  _.button(`Add`) && count++;

  if (_.button("Reset")) {
    count = 0;
    console.log(_.$ev);
  }
});
```

**Result**

<EventHandling />

Now let's explain the code above.

### Declare a State

In the above example, we declare a state `count` to store the count.

As an ImGUI-like framework, you don't need a "reactive system" to handle state changes.

So you can just declare states just like a normal variable. That is, you don't need to use `ref` or `reactive` to declare a state.

:::warning
You SHOULD declare the states in the outer scope of the main function.

Otherwise, the state will be reset every time the main function is called.
:::

### Handle Events

Because most of the components/elements has none or only **one** event that is frequently used, Refina use the return value of the component function to indicate whether that event is triggered.

For instance, the return value of `_.button` is a boolean value, which indicates whether the button is clicked. And the you can use the `if` statement or the `&&` operator to handle the event.

:::tip
Only trigger components like `button` and `input` returns a boolean value which indicates whether the event is triggered.

Other components may values of other meanings.
:::

:::info
As you can seen, the way how Refina handles events is very similar to [Dear ImGui](https://github.com/ocornut/imgui).
:::

### Get the Event Data

The event data is stored in the context object, and you can get it by accessing `_.$ev`.

:::tip
Refina has type definitions for the event data, so you when you hover on `_.$ev`, you can see the type of the event data.

And if you access `_.$ev` out of the event handler (i.e. out of the `if` statement or the `&&` operator), the type of `_.$ev` will be `never`.
:::

:::warning
You can't render a component in the event handler.

The reason is that the event handler is executed in the `RECV` state, but the rendering process is executed in the `UPDATE` state.
:::
