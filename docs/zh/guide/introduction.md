# 简介

## 概览

Refina（名字源于 "refine" 一词）是一个专注于提高开发效率的前端框架。 它有两个主要的特点：

- 一个类 ImGUI 的状态管理机制，提供了类似 [Svelte](https://svelte.dev/) 的开发体验，用更少的代码实现状态同步。

- 更简练的页面渲染模式。这可以大大减少需要编写的代码量。 并且只需要普通的 JS / TS，无需新的语法。

下面是一个最基本的示例：

```ts
import { $app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

$app.use(Basics)(_ => {
  _.button(`Count is: ${count}`) && count++;
});
```

**结果展示**

<script setup>
import CounterVue from '../snippets/counter.vue'
</script>

<CounterVue />

上面的例子展示了Refina的两个核心功能：

- **Declarative Rendering**: Instead of using a DSL like JSX or Vue templates, Refina allows you to write your components using plain JavaScript/TypeScript. So all development tools can directly support Refina.

- **Reactivity**: Refina uses a ImGUI-like state management system. All you need to do is to declare the state you need, just like Svelte. And Refina will automatically update the DOM when the state changes.

你可能已经有了些疑问——先别急。 请继续看下去，以宏观地了解 Refina 作为一个框架提供了什么。

:::tip 预备知识
文档接下来的内容会假设你对 HTML、CSS 和 JavaScript 已经基本熟悉。 如果你对前端开发完全陌生，最好不要直接从一个框架开始进行入门学习——最好是掌握了基础知识再回到这里。 如有需要，你可以通过这些 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) 和 [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) 概述来检验你的知识水平。 如果之前有其他框架的经验会很有帮助，但也不是必须的。
:::

## 尝试使用 Refina

你可以在 [**Playground**](/misc/playground) 快速尝试使用 Refina 开发。
