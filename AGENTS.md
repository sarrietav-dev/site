# Repository Notes

## Commands

- Install Ruby gems with `bundle install`.
- Install Node deps with `npm ci` (or `npm install`); this provides `@mermaid-js/mermaid-cli`, used at build time to pre-render mermaid diagrams to SVG.
- Build the site with `bundle exec jekyll build`; this is the only CI check in `.github/workflows/ci.yml` (which now also runs `npm ci` first).
- Run locally with `bundle exec jekyll serve --livereload`.
- There is no configured test, lint, or typecheck workflow. Node is used only for the mermaid build tooling above.

## Project Shape

- This is a root-level Jekyll site, not an Astro project. `README.md`, `.github/CONTRIBUTING.md`, and the PR template still contain stale Astro/AstroPaper boilerplate.
- Main pages are root `.html` files using YAML front matter; shared structure lives in `_layouts/` and `_includes/`.
- Blog posts live in `_posts/` and default to `layout: post` via `_config.yml`; permalinks are `/blog/:slug/`.
- Styles are in `assets/css/main.scss`; Jekyll compiles it to `assets/css/main.css` in the generated output.

## Generated Files

- Do not edit `_site/` or `.jekyll-cache/`; both are generated and ignored.
- Avoid committing `.env`, `.bundle/`, `vendor/`, `node_modules/`, or Playwright artifacts.

## Content And Rendering Quirks

- `_plugins/obsidian_callouts.rb` converts Obsidian-style blockquotes such as `> [!note] Title` into callout HTML after page/post conversion.
- Callout colors and icons are defined in `assets/css/main.scss`; update plugin output and CSS together if changing callout markup.
- `_plugins/mermaid_svg.rb` pre-renders ` ```mermaid ` blocks to inline SVG at build time (via `mmdc`), emitting light + dark variants toggled by `prefers-color-scheme` in `assets/css/main.scss`. This replaced the old client-side renderer, so diagrams work with JS disabled and no mermaid JS is shipped. Rendered SVGs are cached in `.mermaid-cache/` (gitignored) keyed by content hash; bump `RENDER_VERSION` in the plugin when changing theme colors or SVG post-processing.
- `_config.yml` enables `jekyll-feed`, `jekyll-seo-tag`, and `jekyll-sitemap`; default layout and SEO metadata rely on page/post front matter.
