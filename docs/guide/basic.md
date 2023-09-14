# Basic

## 从 Hello world 开始

### `index.html`

```html
<!doctype html>
<html>
  <head>
    <style>
      <!--引入tailwindcss-->
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    </style>
    <script type="module" src="/src/app.r.ts"></script>
  </head>
  <body id="root">
    <!--应用内容将输出在id为"root"的此处-->
  </body>
</html>
```

### `src/app.r.ts`

> 含有refina主函数的代码文件后缀必须为`.r.ts`，不然不会被转译。

```typescript
import { app } from "refina";
app((_) => {
  _.t`Hello, world!`;
});
```

- 导入的`app`函数用于创建一个应用。
  - 第一个参数为应用的主函数
  - 第二个参数为需要挂载到的DOM元素的id，默认为`root`
- 应用的主函数接受一个参数，即“上下文(context)”。它**必须**被命名为“`_`”
- `_.t`用于输出文本。它会在DOM中创建一个`Text`节点，并将其内容设置为参数中的文本
  > `_.t("Hello world!")`和<code>\_.t\`Hello world!\`</code>是等价的。一般来说只有对于`_.t`才可以省略括号。

## 计数器

```typescript
import { app } from "refina";
let count = 0;
app((_) => {
  if (_.button("Click me!")) {
    count++;
  }
  _.p(`You clicked ${count} times`);
});
```

- 首先，我们用一个普通的变量`count`来存储计数器的值
  > 与vue不同的是，`count`不需要被包裹在`ref()`中
- `_.button`用于创建一个按钮。它接受两个参数：
  - 第一个参数为按钮的内容
  - 第二个参数为按钮是否被禁用。默认为`false`
- 通过`if`语句来判断按钮是否被点击。该按钮被点击后，refina会以`recv`状态调用主函数，此时`_.button`会返回`true`，运行`count++`。像这样通过判断语句接收事件的组件被称为`TriggerComponent`
  > 该判断语句往往被简化为`_.button("Click me!") && count++`
- `_.p`表示以`<p>`为标签的段落元素。它永远永远返回`undefined`，像这样只输出内容的组件被称为`OutputComponent`

## 接受用户输入

```typescript
import { app, d } from "refina";
const name = d("");
app((_) => {
  _.textInput(name);
  _.p(`Hello ${name}!`);
  if (name.value === "refina") {
    _.p("refined is refina!");
  }
});
```

- 首先通过`d`函数创建一个字符串的引用。其参数为初始值
- `_.textInput`接收一个字符串引用，或一个普通的字符串。如果传入的是一个字符串引用，则在这个`<input type="text">`中的输入会被更新至该引用，而普通的字符串则无法被更新。
- 通过`d`创建的引用实现了`[Symbol.toPrimitive]`方法，因此可以直接作为模板字符串的插值。
- 通过`name.value`可以获得引用的值。
- 普通的if语句可以用来控制是否渲染一个组件。

## 嵌套结构

```typescript
import { app, d } from "refina";
const text = d("Hello");
app((_) => {
  _.div(() => {
    _.p((_) => {
      _.p(text);
      _.t`world`;
    });
    _.p(() => _.t`!`);
  });
});
```

- 如果一个元素接受`Content`作为参数，即它接收字符串或数字，或者一个函数表示其内容。也可以传入上述三者的引用
- 嵌套的函数中，既可以使用新传入的上下文，也可以使用外层函数已有的上下文。二者虽然不是同一个对象，但是效果是等价的。

## 循环

```typescript
import { app, d } from "refina";
const list = [1, 2, 4, 8, 16];
app((_) => {
  _.for(
    list,
    (_item, index) => index,
    (value, index) => _.p(`2^${index} is ${value}`),
  );
});
```

- 在refina中不能使用普通的for循环进行渲染。普通的for循环会导致循环体中的内容不断覆盖上一轮循环运行的结果。可以使用`_.for`方法对一个可迭代的对象中的每个元素进行渲染
- `_.for`的第二个参数用于生成该轮循环的key，就像Vue里的`key`属性。在两次可以导入`bySelf`和`byIndex`来自动取出迭代元素的值或下标作为key
