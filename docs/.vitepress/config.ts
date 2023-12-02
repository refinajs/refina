import Refina, { RefinaTransformer } from "vite-plugin-refina";
import { defineConfig } from "vitepress";

class CustomTransformer extends RefinaTransformer {
  shouldTransform(fileName: string): boolean {
    return super.shouldTransform(fileName) || fileName.endsWith(".r.vue");
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Refina",
  description: "An extremely refined web framework",
  vite: {
    plugins: [Refina(new CustomTransformer()) as any],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
      { text: "Examples", link: "https://gallery.refina.vercel.app" },
    ],

    sidebar: [
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
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
