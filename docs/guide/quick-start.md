# Quick Start

:::tip Prerequisites

- Familiarity with the command line
- Install [Node.js](https://nodejs.org/) version 20.0 or higher
  :::

In this section we will introduce how to scaffold a Refina app on your local machine. The created project will be using a build setup based on [Vite](https://vitejs.dev).

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project. Run the following command in your command line (without the `>` sign):

```sh
> pnpm create refina   # or npm create refina
```

This command will install and execute [create-refina](https://github.com/refinajs/refina/tree/main/packages/creator), the official Refina project scaffolding tool. You will be presented with prompts for several optional features such as TailwindCSS support:

![Create Refina](/media/create-refina.png)

:::details The packages we installed

- `typescript` It is greatly recommended to use TypeScript with Refina.
- `vite` The build tool for our project.
- `vite-plugin-refina` The Vite plugin that enables Refina support.
- `refina` The Refina runtime.
- `@refina/basic-components` The basic components of Refina, which isn't required by all projects.
  :::

Once the project is created, follow the instructions to install dependencies and start the dev server:

```sh
> cd refina-project
> npm install
> npm run dev
```

You should now have your first Refina project running!

Then, open the `src/app.r.ts` file, you can see the code of the app. You can edit it and see the changes in the browser.

:::warning
You must use the `.r.ts` pr `.r.js` extension for source files with Refina main functions.

You can configure the extension in the `vite.config.ts` file.
:::
