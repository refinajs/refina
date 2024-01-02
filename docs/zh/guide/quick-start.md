# 快速上手

:::tip 预备知识

- 熟悉命令行
- Install [Node.js](https://nodejs.org/) version 20.0 or higher

:::

In this section, we will introduce how to scaffold a Refina app on your local machine. The created project will be using a build setup based on [Vite](https://vitejs.dev).

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project. Run the following command in your command line (without the `>` sign):

```sh
> npm create refina@latest   # pnpm preferred
```

This command will install and execute [create-refina](https://github.com/refinajs/refina/tree/main/packages/creator), the official Refina project scaffolding tool. You will be presented with prompts for several optional features such as TailwindCSS support:

![Create Refina](/media/create-refina.png)

:::details The packages may be installed according to your choices

- `refina` The Refina core.
- `vite` The build tool for our project.
- `vite-plugin-refina` The Vite plugin that enables Refina support.
- `typescript` The TypeScript compiler, used to check the types of our code.
- `@refina/tsconfig` The base TypeScript configuration for Refina projects.
- `@refina/basic-components` The basic components of Refina.
- `@refina/mdui` The [MdUI v2](https://mdui.org/) components of Refina.
- `postcss` The CSS preprocessor used by Vite.
- `autoprefixer` The PostCSS plugin that adds vendor prefixes to CSS rules.
- `tailwindcss` The CSS framework used by Refina.

:::

在项目被创建后，通过以下步骤安装依赖并启动开发服务器：

```sh
> cd <project-name>
> npm install
> npm run dev
```

你现在应该已经运行起来了你的第一个 Refinan 项目！

现在打开 `src/app.ts` 文件，你可以看见应用的主体代码。 你可以编辑它，并在浏览器中实时查看更改。

:::info

Refina 默认转换所有后缀名为 `.ts` 或 `.js` 的文件。

你可以通过在文件开头添加 `// @refina-ignore` 注释以阻止 Refina 转换该文件。

:::
