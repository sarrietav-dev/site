---
pubDatetime: 2025-07-12
title: How to serve fonts in Rails 8
slug: fonts-rails-8
featured: false
draft: true
description: Adding fonts in Rails is easy
lang: en
translationKey: rails-fonts
---

- Add the font to the fonts folder in assets.
- Place the following line of code in assets/tailwind/application.css

  ```css
  @font-face {
    font-family: "PublicSans";
    font-style: italic;
    font-display: swap;
    src: url("/PublicSans-Italic-VariableFont_wght.ttf") format("truetype"); /* Obtained from the root URL. */
  }

  @theme {
    --font-sans:
      "PublicSans", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  ```

- Use the `font-sans` class in the project.

## How does it work?

Propshaft

