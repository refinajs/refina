# 快速上手

:::tip 预备知识

- 熟悉命令行
- 已安装 20.0 或更高版本的 [Node.js](https://nodejs.org/)。
  :::

In this section, we will introduce how to scaffold a Refina app on your local machine. 创建的项目将使用基于 [Vite](https://vitejs.dev) 的构建设置。

确保你安装了最新版本的 [Node.js](https://nodejs.org/)，并且你的当前工作目录正是打算创建项目的目录。 在命令行中运行以下命令 (不要带上 `>` 符号)：

```sh
> npm create refina@latest   # 推荐使用 pnpm
```

这一指令将会安装并执行 [create-refina](https://github.com/refinajs/refina/tree/main/packages/creator)，它是 Refina 官方的项目脚手架工具。 你将会看到一些诸如组件库和 TailwindCSS 之类的可选功能提示：

![Create Refina](/media/create-refina.png)

:::details 根据你的选择可能被安装的包

- `refina` Refina 核心。
- `vite` 生成工具。
- `vite-plugin-refina` 提供 Refina 支持的 Vite 插件。
- `typescript` TypeScript 编译器，用于类型检查。
- `@refina/tsconfig` 默认的 TypeScript 配置文件。
- `@refina/basic-components` 基础组件库。
- `@refina/mdui` 基于 [MdUI v2](https://mdui.org/) 的组件库。
- `postcss` CSS 预处理器。
- `autoprefixer` 自动补全 CSS 的浏览器前缀。
- `tailwindcss` 原子化 CSS 框架。
  :::

在项目被创建后，通过以下步骤安装依赖并启动开发服务器：

```sh
> cd <project-name>
> npm install
> npm run dev
```

你现在应该已经运行起来了你的第一个 Refinan 项目！

Then, open the `src/app.ts` file, and you can see the code of the app. 你可以编辑它，并在浏览器中实时查看更改。

:::info

By default, Refina will transform all the `.ts` or `.js` files.

你可以通过在文件开头添加 `// @refina-ignore` 注释以阻止 Refina 转换该文件。

:::
