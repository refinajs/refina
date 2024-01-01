# 为什么选 Refina

## 前端的困境

对于大部分前端页面，长什么样、要做什么，往往只需要三言两语就能说明白。 但是若要通过传统的前端框架实现它，往往需要写数百行代码。

传统的前端框架，比如 Vue，配合组件库，比如 Vuetify，允许你编写出细节完善、视觉美观的应用。 但是即使是一些“大厂”，也没能总是产出那么高质量的应用，因为开发效率的原因。 这即是说，即使开发者有能力，往往也会由于没有时间而无法做出相当完美的应用。 结果就是，许多传统前端框架的能力几乎得不到发挥，而为拥有这些能力所作的一些设计反而在很多情况下称为了负担。

除了传统前端框架，我们其实需要一个**首先关注开发效率**，其次是功能的完整性，再其次是运行时性能的前端框架。

## 解决方案

- **类 ImGUI 的状态管理机制**

  省去状态管理带来的一切心智负担。 就像 [Svelte](https://svelte.dev/) 那样无需手动为数据添加响应性，并且不需要复杂的编译器。

- **无需写结束标签**

  End tags are very annoying, and they are not necessary in most cases.

- **Use positional parameters instead of named parameters**

  You needn't to write the name of the parameter, which saves a lot of time.

- **Return value as the event handler**

  Check the return value of the component function to handle events, so you don't need to write another function.

- **Plain TypeScript**

  No DSL like JSX or Vue SFC. So you can use the same syntax in both renderings and logic.

## The Result

Refina is still in the early stage of development, but it has already shown its advantages in development efficiency.

Based on the real projects, the **line of code reduced to about `60%~70%`**, and **the development efficiency is `1.4x~1.6x`** of traditional frameworks.
