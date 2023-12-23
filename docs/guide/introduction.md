# Getting Started

## Overview

Refina（named after the word "refine"）is a web framework that aims to make frontend development easier and more efficient. It consists of two major parts:

- An ImGUI-like state management system, which gives you the experience like [Svelte](https://svelte.dev/), but with much less code.

- A refined page rendering system, which can greatly reduce the amount of code you need to write. And you just need to write plain TypeScript.

Here is a minimal example:

```ts
import { app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

app.use(Basics)(_ => {
  _.button(`Count is: ${count}`) && count++;
});
```

**Result**

<script setup>
import CounterVue from '../snippets/counter.r.vue'
</script>
<CounterVue />

The above example demonstrates the two core features of Refina:

- **Declarative Rendering**: Instead of using a DSL like JSX or Vue templates, Refina allows you to write your components using plain JavaScript/TypeScript. So all development tools can directly support Refina.

- **Reactivity**: Refina uses a ImGUI-like state management system. All you need to do is to declare the state you need, just like Svelte. And Refina will automatically update the DOM when the state changes.

You may already have questions - don't worry. Please read along so you can have a high-level understanding of what Refina offers.

:::tip Prerequisites
The rest of the documentation assumes basic familiarity with HTML, CSS, and JavaScript. If you are totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics and then come back! You can check your knowledge level with these overviews for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) and [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) if needed. Prior experience with other frameworks helps, but is not required.
:::

## Try Refina

You can try Refina in the [**Playground**](/misc/playground).
