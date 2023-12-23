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
        include: [
          /\.[tj]s$/,
          id => id.endsWith(".vue") && !id.includes("node_modules"),
        ],
      }) as any,
    ],
  },
  themeConfig: {
    logo: "/logo.svg",

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
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
          text: "APIs",
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
});
