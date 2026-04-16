import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config";
import { fontFamily } from "astro/fonts";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "hybrid",
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: page =>
        SITE.showArchives || !page.includes("/archives/") && !page.includes("/page/"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
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
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  experimental: {
    preserveScriptOrder: true,
    fonts: [
      fontFamily({
        name: "Google Sans Code",
        cssVariable: "--font-google-sans-code",
        provider: "google",
        weights: [300, 400, 500, 600, 700],
        styles: ["normal", "italic"],
        subsets: ["latin"],
        fallback: ["monospace"],
        optimizedLoading: true,
      }),
    ],
  },
});
