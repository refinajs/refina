# 获取用户输入

通过接收事件，我们可用获取用户输入并据此更新状态：

```ts
let name = "";

$app.use(Basics)(_ => {
  if (_.textInput(name)) {
    name = _.$ev;
  }
  _.p(`Hello ${name}!`);
});
```

试着在 "PREVIEW" 栏中的输入框中输入字符，你会看见 `<p>` 中的文字同步更新。

还有一个更加简单的方式可以将用户输入直接保存到一个状态，而无需手动处理事件以保存输入：

```ts
import { $app, model } from "refina";

const name = model("");

$app.use(Basics)(_ => {
  _.textInput(name);

  _.p(`Hello ${name}!`);
  // 等价于：
  // _.p(`Hello ${name.value}!`);
});
```

`model` 函数创建了一个 `JustModel<T>` 对象。它简单地把原始值包裹为对象，于是组件可以“引用”到值并直接更新它。

`textInput` 组件（以及一些类似的组件）接收 类型为 `Model<string>` 的值作为它的第一个参数，即，既可以是原始值也可以是 model。 当用户在输入框中输入时，组件会更新 model 的值。

现在，试着使用 `model` 重构编辑器中的代码。 并且在当输入框不为空时显示一个可以清除输入内容的按钮。
