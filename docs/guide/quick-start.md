# Quick Start

:::tip Prerequisites

- Familiarity with the command line
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

Once the project is created, follow the instructions to install dependencies and start the dev server:

```sh
> cd <project-name>
> npm install
> npm run dev
```

You should now have your first Refina project running!

Then, open the `src/app.ts` file, and you can see the code of the app. You can edit it and see the changes in the browser.

:::info

By default, Refina will transform all the `.ts` or `.js` files.

You can prevent Refina from transforming a file by adding a `// @refina-ignore` comment at the top of the file.

:::
