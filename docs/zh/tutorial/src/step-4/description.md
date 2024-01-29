# 状态

Refina 中的状态是普通的 JavaScript 变量。 你可以使用状态来存储数据，并渲染动态的内容。

```ts
let message = "Hello World!";
let person = {
  id: 1,
  name: "John Doe",
};

$app([Basics], _ => {
  _.h1(message);
  _.p(`Hello ${person.name}!`);
});
```

:::warning States should be declared outside the main function.

Variables declared inside the main function are not states. They are just local temporary variables, which are re-created every time the main function is called.

:::

就像在 JSX 中那样，你可以使用 `if` 语句或者其他运算符来根据条件渲染组件：

```ts
let cond = true;
let value: number | null | undefined;

$app([Basics], _ => {
  if (cond) {
    _.h1("Hello World!");
  } else {
    _.h1("Hello Refina!");
  }

  cond && _.p("cond is truthy.");
  value === 1 && _.p("value is 1.");
  value ?? _.p("value is null or undefined.");
});
```

现在，请尝试自己创建一个 "count" 状态，并用它来渲染 `_.p` 组件的内容。
