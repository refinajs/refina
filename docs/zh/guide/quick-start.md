# Quick Start

:::tip Prerequisites

- Familiarity with the command line
- Install [Node.js](https://nodejs.org/) version 20.0 or higher
  :::

In this section we will introduce how to scaffold a Refina app on your local machine. The created project will be using a build setup based on [Vite](https://vitejs.dev).

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project. Run the following command in your command line (without the `>` sign):

```sh
> npm init
> npm install -D typescript vite vite-plugin-refina refina @refina/basic-components
```

:::details The packages we installed

- `typescript` It is greatly recommended to use TypeScript with Refina.
- `vite` The build tool for our project.
- `vite-plugin-refina` The Vite plugin that enables Refina support.
- `refina` The Refina runtime.
- `@refina/basic-components` The basic components of Refina, which isn't required by all projects.
  :::

Then, create a `vite.config.ts` file in the root directory of your project with the following content:

```ts
import { defineConfig } from "vite";
import Refina from "vite-plugin-refina";

export default defineConfig({
  plugins: [Refina()], // Use the Refina plugin
});
```

Now, create a `index.html` file in the root directory of your project with the following content:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Refina App</title>
    <script type="module" src="/src/app.r.ts"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Then, create a `src/app.r.ts` file in the root directory of your project with the following content:

```ts
import { app } from "refina";
import Basics from "@refina/basic-components";

app.use(Basics)(_ => {
  _.h1("Hello, Refina!");
});
```

:::warning
You must use the `.r.ts` extension for source files with Refina main functions.
:::

Finally, run the following command in your command line:

```sh
> npx vite
```

## Use Prettier for code formatting {#use-prettier}

To use [Prettier](https://prettier.io/) for code formatting, run the following command in your command line:

```sh
> npm install -D prettier
```

Then, create a `.prettierrc` file in the root directory of your project with the following content:

```json
{
  "arrowParens": "avoid"
}
```
