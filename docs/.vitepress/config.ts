import Refina from "vite-plugin-refina";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Refina",
  description: "An extremely refined web framework",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  vite: {
    plugins: [
      Refina({
        include: [/\.vue(\?|$)/, /\.[tj]s(\?|$)/],
        exclude: [/\.data\.ts/, /node_modules/],
      }) as any,
    ],
    resolve: {
      alias: {
        snippets: "/snippets",
        helpers: "/helpers",
      },
    },
    optimizeDeps: {
      exclude: ["@refina/repl"],
    },
    server: {
      fs: {
        allow: ["../../../.."],
      },
    },
  },
  themeConfig: {
    logo: "/logo.svg",

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide/introduction" },
      { text: "Tutorial", link: "/tutorial/" },
      { text: "Components", link: "/std-comps/introduction" },
      { text: "Playground", link: "/misc/playground" },
      { text: "Examples", link: "https://gallery.refina.vercel.app" },
      { text: "Contact Us", link: "/misc/contact" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Why Refina", link: "/guide/why" },
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Quick Start", link: "/guide/quick-start" },
          ],
        },
        {
          text: "Essentials",
          items: [
            {
              text: "Create an Application",
              link: "/guide/essentials/application",
            },
            {
              text: "The App State",
              link: "/guide/essentials/app-state",
            },
            { text: "The Context Object", link: "/guide/essentials/context" },
            {
              text: "Rendering Basics",
              link: "/guide/essentials/rendering-basics",
            },
            {
              text: "Conditional Rendering",
              link: "/guide/essentials/conditional",
            },
            { text: "List Rendering", link: "/guide/essentials/list" },
            { text: "Handle Events", link: "/guide/essentials/event" },
            { text: "Get the Input Value", link: "/guide/essentials/input" },
            { text: "Lowlevel Rendering", link: "/guide/essentials/lowlevel" },
            { text: "Views", link: "/guide/essentials/view" },
            { text: "Components", link: "/guide/essentials/component" },
          ],
        },
        {
          text: "API",
          items: [
            { text: "Directives", link: "/guide/apis/directives" },
            { text: "Utility Functions", link: "/guide/apis/util-funcs" },
            { text: "App Hooks", link: "/guide/apis/app-hooks" },
          ],
        },
      ],
      "/std-comps/": [
        {
          text: "Introduction",
          link: "/std-comps/introduction",
        },
        {
          text: "Button",
          link: "/std-comps/button",
        },
        {
          text: "Text Field",
          link: "/std-comps/text-field",
        },
        { text: "Dialog", link: "/std-comps/dialog" },

        {
          text: "Checkbox",
          link: "/std-comps/checkbox",
        },
        {
          text: "List",
          link: "/std-comps/list",
        },
        {
          text: "Table",
          link: "/std-comps/table",
        },
        {
          text: "Radio Group",
          link: "/std-comps/radio-group",
        },
        {
          text: "Tabs",
          link: "/std-comps/tabs",
        },
        {
          text: "Slider",
          link: "/std-comps/slider",
        },
        {
          text: "Nav Rail",
          link: "/std-comps/nav-rail",
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/refinajs/refina" },
    ],

    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    zh: {
      label: "简体中文",
      lang: "zh-cn",
      themeConfig: {
        nav: [
          { text: "指南", link: "/zh/guide/introduction" },
          { text: "互动教程", link: "/zh/tutorial/" },
          { text: "标准组件", link: "/zh/std-comps/introduction" },
          { text: "演练场", link: "/zh/misc/playground" },
          { text: "组件库", link: "https://gallery.refina.vercel.app" },
          { text: "关于", link: "/zh/misc/contact" },
        ],

        sidebar: {
          "/zh/guide/": [
            {
              text: "开始",
              items: [
                { text: "为什么选 Refina", link: "/zh/guide/why" },
                { text: "简介", link: "/zh/guide/introduction" },
                { text: "快速上手", link: "/zh/guide/quick-start" },
              ],
            },
            {
              text: "基础",
              items: [
                {
                  text: "创建一个应用",
                  link: "/zh/guide/essentials/application",
                },
                {
                  text: "应用状态",
                  link: "/zh/guide/essentials/app-state",
                },
                {
                  text: "上下文对象",
                  link: "/zh/guide/essentials/context",
                },
                {
                  text: "渲染基础",
                  link: "/zh/guide/essentials/rendering-basics",
                },
                {
                  text: "条件渲染",
                  link: "/zh/guide/essentials/conditional",
                },
                { text: "列表渲染", link: "/zh/guide/essentials/list" },
                { text: "事件处理", link: "/zh/guide/essentials/event" },
                {
                  text: "获取用户输入",
                  link: "/zh/guide/essentials/input",
                },
                {
                  text: "底层渲染",
                  link: "/zh/guide/essentials/lowlevel",
                },
                { text: "视图", link: "/zh/guide/essentials/view" },
                { text: "组件", link: "/zh/guide/essentials/component" },
              ],
            },
            {
              text: "API",
              items: [
                { text: "指令", link: "/zh/guide/apis/directives" },
                { text: "工具函数", link: "/zh/guide/apis/util-funcs" },
                { text: "钩子", link: "/zh/guide/apis/app-hooks" },
              ],
            },
          ],
          "/zh/std-comps/": [
            {
              text: "简介",
              link: "/zh/std-comps/introduction",
            },
            {
              text: "Button",
              link: "/zh/std-comps/button",
            },
            {
              text: "Text Field",
              link: "/zh/std-comps/text-field",
            },
            { text: "Dialog", link: "/zh/std-comps/dialog" },

            {
              text: "Checkbox",
              link: "/zh/std-comps/checkbox",
            },
            {
              text: "List",
              link: "/zh/std-comps/list",
            },
            {
              text: "Table",
              link: "/zh/std-comps/table",
            },
            {
              text: "Radio Group",
              link: "/zh/std-comps/radio-group",
            },
            {
              text: "Tabs",
              link: "/zh/std-comps/tabs",
            },
            {
              text: "Slider",
              link: "/zh/std-comps/slider",
            },
            {
              text: "Nav Rail",
              link: "/zh/std-comps/nav-rail",
            },
          ],
        },
      },
    },
  },
});
