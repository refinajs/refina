# 应用状态

App can be in one of the following three states:

- `IDLE`: The main function of the App is not running.
- `UPDATE`: Render the page.
- `RECV`: Receive an event.

![App States Graph](/media/app-states.png)

## The `IDLE` State

After the execution is finished in the `UPDATE` state, the App will enter the `IDLE` state.

## The `UPDATE` State

There are three ways to enter the `UPDATE` state:

- Mount the App.
- Call the `update` method of the App.
- The event queue becomes empty.

In the `UPDATE` state, the App will render the DOM tree and update the page.

:::tip
Multiple `UPDATE` calls will be merged into one.
:::

:::danger
You SHOULD NOT change the state in the `UPDATE` state.

The following code is illegal, and may cause undefined behavior:

```ts
let count = 0;
$app.use(Basics)(_ => {
  _.p(`Count is: ${count}`);
  count++; // The state will change in the UPDATE state
});
```

:::

## The `RECV` State

When an event is received, the App will enter the `RECV` state.

In this state, the return values of the trigger components can be `true`, if it is the event receiver.

After the execution is finished in the `RECV` state, the App will always enter the `UPDATE` state.

:::danger
You can't render the page in the `RECV` state.

The following code is illegal, and may cause undefined behavior:

```ts
$app.use(Basics)(_ => {
  if (_.button("Click me")) {
    _.p("Hello");
  }
});
```

:::
