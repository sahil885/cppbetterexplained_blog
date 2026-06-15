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
        // Exclude all numbered pagination pages (/posts/2/ ... /posts/N/) from the sitemap.
        // Keeps /posts/ (page 1) and article slugs.
        !/\/posts\/\d+\/?$/.test(page),
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
