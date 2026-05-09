---
title: Flexoki Syntax Highlighting Test
description: Testing Flexoki color scheme for code blocks in blog posts.
pubDate: 2026-05-09
---

This is a test post to verify that Flexoki syntax highlighting is working correctly across different programming languages.

## JavaScript

Here's some JavaScript code with Flexoki colors:

```javascript
function greet(name) {
  // This is a comment
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

const result = greet('World');
```

## Python

Python code example:

```python
def fibonacci(n):
    """Calculate fibonacci number at position n."""
    if n <= 1:
        return n
    
    return fibonacci(n - 1) + fibonacci(n - 2)

# Calculate the 10th fibonacci number
result = fibonacci(10)
print(f"Result: {result}")
```

## HTML

HTML markup:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Flexoki Test</title>
  </head>
  <body>
    <h1>Welcome to Flexoki</h1>
    <p>This is a test of syntax highlighting.</p>
  </body>
</html>
```

## CSS

CSS styling:

```css
:root {
  --color-primary: #AF3029;
  --color-secondary: #24837B;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
}

.highlight {
  color: var(--color-primary);
  font-weight: 600;
}
```

## Inline Code

You can also use inline code like `const x = 42;` or `function greet()` within paragraphs. These should have a subtle background color.

## Testing

The Flexoki theme provides:
- **Comments**: Light gray color
- **Keywords**: Green color
- **Strings**: Cyan color
- **Numbers**: Purple color
- **Functions**: Orange color
- **Variables**: Blue color

Verify that all colors are visible and readable in both light and dark modes!
