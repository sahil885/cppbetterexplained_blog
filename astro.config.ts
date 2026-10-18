import { defineConfig } from "astro/config";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkBookCta from "./src/utils/remarkBookCta";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config";

// <lastmod> for sitemap entries: each post's modDatetime, or its pubDatetime if
// it has never been modified. The homepage and /posts/ use the newest post date.
function readPostDates(): Map<string, string> {
  const dir = fileURLToPath(new URL("./src/data/blog/", import.meta.url));
  const dates = new Map<string, string>();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const frontmatter = fs.readFileSync(dir + file, "utf8").split(/^---$/m)[1] ?? "";
    if (/^draft:\s*true/m.test(frontmatter)) continue;
    const pick = (key: string) =>
      frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\s]+)`, "m"))?.[1];
    const modified = pick("modDatetime");
    const date =
      modified && !Number.isNaN(Date.parse(modified)) ? modified : pick("pubDatetime");
    if (!date || Number.isNaN(Date.parse(date))) continue;
    dates.set(`/posts/${file.slice(0, -3)}/`, new Date(date).toISOString());
  }
  return dates;
}
const postDates = readPostDates();
const newestPostDate = [...postDates.values()].sort().at(-1);

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page =>
        !page.includes("/tags/") &&
        !page.includes("/search") &&
        (SITE.showArchives || !page.includes("/archives/")) &&
        // Exclude all numbered pagination pages (/posts/2/ ... /posts/N/) from the sitemap.
        // Keeps /posts/ (page 1) and article slugs.
        !/\/posts\/\d+\/?$/.test(page),
      serialize(item) {
        const { pathname } = new URL(item.url);
        const lastmod =
          pathname === "/" || pathname === "/posts/"
            ? newestPostDate
            : postDates.get(pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
      remarkBookCta,
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
