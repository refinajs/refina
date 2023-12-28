# refina

![npm](https://img.shields.io/npm/v/refina?label=core&color=green)

[**Documentation**](https://refina.vercel.app/) |
[**Examples**](https://gallery.refina.vercel.app/) |
[**Get Started**](https://refina.vercel.app/guide/introduction.html) |
[**Why Refina**](https://refina.vercel.app/guide/why.html)

### 🆕 An extremely **refined** web framework. 🆕

⚡ Line of code reduced to about `60%~70%` of traditional frameworks. _(Approximately, based on real projects)_

⚡ Development efficiency is `1.4x~1.6x` of traditional frameworks. _(Approximately, based on real projects)_

✅ ImGUI-like state management, which gives you the experience like Svelte, but with much less code.

✅ No DSL like JSX or Vue SFC, just plain TypeScript, with a little bit comptime transformation.

✅ Full TypeScript support, everything is typed, even some dynamic states.

✅ No need to write any end tags.

✅ Use positional parameters, which is more concise than named parameters.

📦 The adaptation of [MdUI v2](https://github.com/zdhxiong/mdui) component library is available.

📦 The rewrite of [Fluent UI v9](https://react.fluentui.dev/) component library is partially available.

🛢️ Work well with [Tailwind CSS](https://tailwindcss.com/).

🛢️ You can also use the CSS-in-JS library [Griffel](https://griffel.js.org/).

🛠️ Work well with [Vite](https://vitejs.dev/).

## Example

```typescript
import { $app, d } from "refina";
import Basics from "@refina/basic-components";

const name = d(""); // just the same as { value: "" }
let count = 0; // needn't to be warped in d()

$app.use(Basics)(_ => {
  _.t`Enter your name:`;

  _.textInput(name);

  if (_.button("Click me!", name.length === 0)) {
    // returns true if the button is clicked
    count++;
    console.log(_.$ev);
    // (TS)        ^? :MouseEvent
  }

  // use if statement to control the rendering
  if (count > 0) {
    _.h1(`You have clicked ${count} times`);
  }
});
```

> There are more examples in the [documentation](https://refina.vercel.app/).

## refina 简介

> 注：以下是一些早期的设计理念，部分内容已过时。

### 有许多成熟的前端框架，还需要一个新的吗？

在现在的多数网页应用里，一个页面长啥样、干啥事，其实三言两语就可以描述出来，但是用传统的前端框架实现它，却动辄数百行代码。对诸如图书检索、设备报修等数据管理型的应用，尤为如此。是时候改变这种现象了。

固然传统前端框架，比如 Vue 搭配 Vuetify，理论上可以做出细节完善、外观精美的应用。但事实上即使是某些“大厂”，也都出于开发效率的考虑，几乎从未做出过这样的网页。能够利用上传统前端框架的这些功能者少之又少，其高度可定制性成了累赘。

我们需要一款在**首先保证开发效率极高**的基础上尽可能优雅和强大的前端框架。

### 主流前端框架的不足，在本框架中可以被改进的地方

> 注：以下内容仅为个人看法，并且着重从开发效率角度考虑，不十分全面，也不一定准确。

**共性问题**

1. 没有为元素或组件的常用属性提供快捷传入的支持。即，所有参数/属性都是按名称传入的，不能按位置传入。这导致了代码冗长
2. 需要写无实际意义的 end tag，导致代码冗长

**Svelte**

1. 编译过程复杂，导致用户难以想象生成的代码
2. 多个私有语法去实现复杂的模板渲染，导致同一套操作（例如 if 和 filter）在 JS 和模板中有两套语法，增加了复杂度和学习成本

**Vue**

除了以上共性问题外，没有明显的不足

**React**

1. 代码太长，导致开发效率不高
2. 有时候简单的逻辑需要复杂的响应式实现

**Blazor**

1. .NET 运行时的加载问题
2. 对于传统的 JS 开发者不友好，难以利用丰富的 JS 库
3. 同样，没有为 HTML 元素的常用属性提供快捷传入的支持

#### 关于 Dear IMGUI 项目

IMGUI（Immediate Mode GUI）在 UI 状态管理上，是传统的 RMGUI 的反义词。一种简单的理解就是“组件内部没有状态，组件的外观完全由当次调用的参数决定”。

属于 IMGUI 的 C++著名项目 Dear IMGUI 已经在桌面应用领域颇有名气了。凭借 IMGUI 的特性，它可以非常快速地用很短的代码开发轻量级的应用。

但是在 Web 端并不能照搬 Dear IMGUI 的代码，有这几个原因：

1. 语言不同，直接照抄 C++ 代码无法利用 JS 的高度动态特性。
2. Web 端的渲染结果不是图形绘制，而是 DOM，而 DOM 自身只能是有状态的。
3. Web 端可以也实际上必须利用 CSS。
4. Dear IMGUI 开发出的应用多作为开发工具，而 Web 端应用多面向普通用户。
5. Web 应用经常要和后端产生数据交互，而桌面应用不需要或很少需要。

这就意味着本框架**绝不是 Dear IMGUI 的移植或重写**。为了适应 Web 端的种种特性，本框架在 UI 状态管理上与 Dear IMGUI 有诸多不同。准确地说，本框架不能算作严格意义上的 IMGUI，而是借鉴了 IMGUI 的一些思想。

#### 为什么 IMGUI 开发效率高？

1. **无状态**。作为框架用户，不需要给数据做响应式，也不需要指定回调函数。
2. **只有最重要的代码**。HTML 中，input 元素都应该带上 type 这个属性，却极少用到 list 这个属性。而前者仍然需要手动写`type=" "`这几个字。而 IMGUI 中则直接将其分为 TextInput 和 Checkbox 等。button 元素 99%要处理 click 事件，但是 onclick 几个字并不比 onready 要短。IMGUI 则不同：button 的布尔类型的返回值即它是否被点击。

#### 本框架兼容 TypeScript 语法

同时，为了降低学习成本，并尽可能复用社区的已有工具，我们不像 C++/CX 那样引入新的语法，而是像 C++/WinRT 那样适应现有语法，只在普通 TypeScript 的基础上引入一些新的语义。即，本框架必须满足：现有的 TypeScript Language Server 能够直接工作。

> 注：虽然 refina 代码需要经过编译才能成为无运行时错误的 TypeScript 代码，但实际上目前版本的编译器只需做 3 个简单的正则表达式替换即可。

### 框架预期效果

1. 提供 router 和对标 Vuetify or AntDesign 的组件库。
2. 有传统 Web 开发基础者，可在**一天内**上手，做出现实可用的应用。
3. 对于数据管理类应用，代码量减少至传统前端框架的**60%-70%**。

### AI 时代的一些想法

只要 `开发者把自己想法实现为代码的成本 < 告诉AI这个想法的成本`，AI 就不会取代开发者！

Refina 的最高纲领就是要实现这样的效果。
