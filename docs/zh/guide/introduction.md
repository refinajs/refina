# 简介

## 概览

Refina（named after the word "refine"）is a web framework that puts development efficiency first. It builds on top of standard HTML, CSS, and TypeScript and provides a declarative and component-based programming model that helps you efficiently develop user interfaces, be they simple or complex.

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
import CounterVue from 'snippets/counter.vue'
</script>

<CounterVue />

上面的例子展示了Refina的两个核心功能：

- **Declarative Rendering**: Instead of using a DSL like JSX or Vue templates, Refina allows you to write your components using plain JavaScript/TypeScript. So all development tools can directly support Refina.

- **Reactivity**: Refina uses an ImGUI-like state management system. All you need to do is to declare the state you need, just like Svelte. Refina will automatically update the DOM when the state changes.

你可能已经有了些疑问——先别急。 请继续看下去，以宏观地了解 Refina 作为一个框架提供了什么。

:::tip 预备知识

文档接下来的内容会假设你对 HTML、CSS 和 JavaScript 已经基本熟悉。 如果你对前端开发完全陌生，最好不要直接从一个框架开始进行入门学习——最好是掌握了基础知识再回到这里。 如有需要，你可以通过这些 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) 和 [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) 概述来检验你的知识水平。 如果之前有其他框架的经验会很有帮助，但也不是必须的。

:::

## 尝试使用 Refina

你可以在 [**Playground**](/misc/playground) 快速尝试使用 Refina 开发。
