# 状态

Refina 中的状态是普通的 JavaScript 变量。 你可以使用状态来存储数据，并渲染动态的内容。

```ts
let message = "Hello World!";
let person = {
  id: 1,
  name: "John Doe",
};

$app.use(Basics)(_ => {
  _.h1(message);
  _.p(`Hello ${person.name}!`);
});
```

:::warning 状态应当定义在视图函数的外部

在视图函数内部定义的函数不是状态。 它们只是局部的临时变量，在每次调用视图函数时被重新创建。

:::

就像在 JSX 中那样，你可以使用 `if` 语句或者其他运算符来根据条件渲染组件：

```ts
let cond = true;
let value: number | null | undefined;

$app.use(Basics)(_ => {
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
