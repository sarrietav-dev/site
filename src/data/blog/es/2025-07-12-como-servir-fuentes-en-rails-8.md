---
pubDatetime: 2025-07-12
title: Cómo servir fuentes en Rails 8
slug: fuentes-rails-8
featured: false
draft: true
description: Agregar fuentes en Rails es fácil
lang: es
translationKey: rails-fonts
---

- Agrega la fuente a la carpeta fonts en assets.
- Coloca la siguiente línea de código en assets/tailwind/application.css

  ```css
  @font-face {
    font-family: "PublicSans";
    font-style: italic;
    font-display: swap;
    src: url("/PublicSans-Italic-VariableFont_wght.ttf") format("truetype"); /* Obtenido desde la URL raíz. */
  }

  @theme {
    --font-sans:
      "PublicSans", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  ```

- Usa la clase `font-sans` en el proyecto.

## ¿Cómo funciona?

Propshaft
