import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  redirects: {
    "/sitemap.xml": "/sitemap-index.xml",
    "/home": "/",
    "/home/": "/",
    "/how-to-implement-insertion-sort-in-cpp": "/posts/insertion-sort-cpp/",
    "/how-to-implement-insertion-sort-in-cpp/": "/posts/insertion-sort-cpp/",
    "/understanding-and-breaking-down-pointers": "/posts/pointers-in-cpp/",
    "/understanding-and-breaking-down-pointers/": "/posts/pointers-in-cpp/",
    "/copy-constructor-with-example": "/posts/cpp-copy-constructor/",
    "/copy-constructor-with-example/": "/posts/cpp-copy-constructor/",
  },
  integrations: [
    sitemap({
      filter: page =>
        !page.includes("/tags/") &&
        !page.includes("/search") &&
        (SITE.showArchives || !page.includes("/archives/")) &&
        !page.includes("/posts/2/") &&
        !page.includes("/posts/3/") &&
        !page.includes("/posts/4/") &&
        !page.includes("/posts/5/") &&
        !page.includes("/posts/6/") &&
        !page.includes("/posts/7/") &&
        !page.includes("/posts/8/") &&
        !page.includes("/posts/9/") &&
        !page.includes("/posts/10/") &&
        !page.includes("/posts/11/"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: true,
      transformers: [],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
  image: { responsiveStyles: true, layout: "constrained" },
  experimental: { preserveScriptOrder: true },
});
