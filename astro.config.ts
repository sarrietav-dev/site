import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  transformerNotationDiff,
  transformerNotationWordHighlight,
  transformerMetaHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import green_shiki_theme from "./green_shiki_theme.json";
import green_light_shiki_theme from "./green_light_shiki_theme.json";

const lightTheme = {
  name: green_light_shiki_theme.name,
  fg: green_light_shiki_theme.colors["editor.foreground"],
  bg: green_light_shiki_theme.colors["editor.background"],
  settings: green_light_shiki_theme.tokenColors,
};

const darkTheme = {
  name: green_shiki_theme.name,
  fg: green_shiki_theme.colors["editor.foreground"],
  bg: green_shiki_theme.colors["editor.background"],
  settings: green_shiki_theme.tokenColors,
};

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    react(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      // themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
      wrap: false,
      transformers: [
        transformerMetaHighlight(),
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
