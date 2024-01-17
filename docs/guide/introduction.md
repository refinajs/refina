# Introduction

## Overview

Refina（named after the word "refine"）is a web framework that puts development efficiency first. It builds on top of standard HTML, CSS, and TypeScript and provides a declarative and component-based programming model that helps you efficiently develop user interfaces, be they simple or complex.

Here is a minimal example:

```ts
import { $app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

$app.use(Basics)(_ => {
  _.button(`Count is: ${count}`) && count++;
});
```

**Result**

<script setup>
import "@vue/theme";
import CounterVue from "snippets/counter.vue"
</script>
<CounterVue />

The above example demonstrates the two core features of Refina:

- **Declarative Rendering**: Instead of using a DSL like JSX or Vue templates, Refina allows you to write your components using plain JavaScript/TypeScript. So all development tools can directly support Refina.

- **Reactivity**: Refina uses an ImGUI-like state management system. All you need to do is to declare the state you need, just like Svelte. Refina will automatically update the DOM when the state changes.

You may already have questions - don't worry. Please read along so you can have a high-level understanding of what Refina offers.

:::tip Prerequisites

The rest of the documentation assumes basic familiarity with HTML, CSS, and JavaScript. If you are totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics and then come back! You can check your knowledge level with these overviews for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) and [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) if needed. Prior experience with other frameworks helps, but is not required.

:::

## Pick Your Learning Path

Different developers have different learning styles. Feel free to pick a learning path that suits your preference - although we do recommend going over all of the content, if possible!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="../tutorial/">
    <p class="next-steps-link">Try the Tutorial</p>
    <p class="next-steps-caption">For those who prefer learning things hands-on.</p>
  </a>
  <a class="vt-box" href="./quick-start">
    <p class="next-steps-link">Read the Guide</p>
    <p class="next-steps-caption">The guide walks you through every aspect of the framework in full detail.</p>
  </a>
  <a class="vt-box" href="/misc/playground">
    <p class="next-steps-link">Playground</p>
    <p class="next-steps-caption">Explore Refina on your own.</p>
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
