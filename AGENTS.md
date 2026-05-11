# Repository Notes

## Commands

- Install Ruby gems with `bundle install`.
- Build the site with `bundle exec jekyll build`; this is the only CI check in `.github/workflows/ci.yml`.
- Run locally with `bundle exec jekyll serve --livereload`.
- There is no configured test, lint, typecheck, or Node package workflow in the current repo.

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
- `_config.yml` enables `jekyll-feed`, `jekyll-seo-tag`, and `jekyll-sitemap`; default layout and SEO metadata rely on page/post front matter.
