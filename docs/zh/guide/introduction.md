# 简介

## 概览

Refina（名字源于 "refine" 一词）是一个专注于提高开发效率的前端框架。 它基于标准 HTML、CSS 和 TypeScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Refina 都可以胜任。

下面是一个最基本的示例：

```ts
import { $app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

$app([Basics], _ => {
  _.button(`Count is: ${count}`) && count++;
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
```

**结果展示**

<script setup>
import CounterVue from 'snippets/counter.vue'
</script>

<CounterVue />

上面的例子展示了Refina的两个核心功能：

- **声明式渲染**: 不需要像 JSX 或 Vue template 那样的 DSL，只需普通的 JavaScript/TypeScript 就可以编写应用。 因此所有 JavaScript 与 TypeScript 开发工具都可以在 Refina 开发中直接使用。

- **响应性**：Refina 采用类 ImGUI 的状态管理模式。 你只需要像 Svelte 那样以最普通的方式的定义状态。 当状态改变时，Refina 会自动地更新页面。

你可能已经有了些疑问——先别急。 请继续看下去，以宏观地了解 Refina 作为一个框架提供了什么。

:::tip 预备知识

文档接下来的内容会假设你对 HTML、CSS 和 JavaScript 已经基本熟悉。 如果你对前端开发完全陌生，最好不要直接从一个框架开始进行入门学习——最好是掌握了基础知识再回到这里。 如有需要，你可以通过这些 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) 和 [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) 概述来检验你的知识水平。 如果之前有其他框架的经验会很有帮助，但也不是必须的。

:::

## 选择你的学习路径

不同的开发者有不同的学习方式。 尽管在可能的情况下，我们推荐你通读所有内容，但你还是可以自由地选择一种自己喜欢的学习路径！

<div class="vt-box-container next-steps">
  <a class="vt-box" href="../tutorial/">
    <p class="next-steps-link">尝试互动教程</p>
    <p class="next-steps-caption">适合喜欢边动手边学的读者。</p>
  </a>
  <a class="vt-box" href="./quick-start">
    <p class="next-steps-link">继续阅读该指南</p>
    <p class="next-steps-caption">该指南会带你深入了解框架所有方面的细节。</p>
  </a>
  <a class="vt-box" href="/misc/playground">
    <p class="next-steps-link">前往演练场</p>
    <p class="next-steps-caption">自由地探索 Refina。</p>
  </a>
</div>

<style scoped>
.next-steps > * {
  text-decoration: none;
}
.next-steps .vt-box {
  border: 1px solid transparent;
}
.next-steps .vt-box:hover {
  border-color: var(--vp-c-brand);
  transition: border-color .3s cubic-bezier(.25,.8,.25,1);
}
.next-steps-link {
  font-size: 20px;
  line-height: 1.4;
  letter-spacing: -.02em;
  margin-bottom: .75em;
  display: block;
  color: var(--vp-c-brand);
}
.next-steps-caption {
  margin-bottom: 0;
  color: var(--vp-c-text-2);
  transition: color .5s;
}
</style>
