#!/usr/bin/env bash
set -euo pipefail

EN_POST="$1"
POSTS_DIR="$(dirname "$EN_POST")"

# Extract frontmatter fields
title=$(sed -n 's/^title: //p' "$EN_POST" | head -1)
date=$(sed -n 's/^date: //p' "$EN_POST" | head -1 | grep -oP '^\d{4}-\d{2}-\d{2}')
description=$(sed -n 's/^description: //p' "$EN_POST" | head -1)
translation_key=$(sed -n 's/^translation_key: //p' "$EN_POST" | head -1)

# Generate translation_key from filename if not set
if [[ -z "$translation_key" ]]; then
  basename=$(basename "$EN_POST" .md)
  translation_key="${basename#????-??-??-}"  # strip YYYY-MM-DD- prefix
fi

# Skip if Spanish version already exists
if grep -rl "translation_key: $translation_key" "$POSTS_DIR" 2>/dev/null | xargs grep -l "^lang: es" 2>/dev/null | grep -q . 2>/dev/null; then
  echo "blog: Spanish translation already exists for $translation_key"
  exit 0
fi

# Add lang: en and translation_key to English post if missing (using awk to preserve structure)
if ! grep -q "^lang:" "$EN_POST"; then
  awk '/^---$/{if(++count==2){print "lang: en"; print "translation_key: '$translation_key'"}} 1' "$EN_POST" > "$EN_POST.tmp" && mv "$EN_POST.tmp" "$EN_POST"
elif ! grep -q "^translation_key:" "$EN_POST"; then
  sed -i "/^lang: en/a translation_key: $translation_key" "$EN_POST"
fi

# Translate using Claude CLI, fallback to opencode
PROMPT="Translate this Jekyll blog post to Spanish. Return ONLY the complete translated post (frontmatter + body), nothing else.

Rules:
- Translate title, description, and body text to Spanish
- Keep date, translation_key, and all other non-text fields unchanged
- Set lang: es
- Add a permalink field: /es/blog/<spanish-slug>/ where the slug is the translated title in kebab-case
- Do NOT include \`\`\`yaml or \`\`\`markdown fences — return raw markdown

Post to translate:
$(cat "$EN_POST")"

translated=$(claude -p "$PROMPT" 2>/dev/null || true)

# Fallback to opencode if claude failed
if [[ -z "$translated" ]]; then
  echo "blog: claude failed, trying opencode..." >&2
  translated=$(opencode run "$PROMPT" 2>/dev/null || true)
fi

if [[ -z "$translated" ]]; then
  echo "⚠️  Translation failed — both claude and opencode returned empty output" >&2
  exit 1
fi

# Extract Spanish slug from the permalink line
es_slug=$(echo "$translated" | grep "^permalink:" | sed 's|.*/es/blog/||;s|/$||' | head -1)
if [[ -z "$es_slug" ]]; then
  es_slug="es-$(basename "$EN_POST" .md)"
fi

# Write Spanish post
es_filename="${date}-${es_slug}.md"
es_post="$POSTS_DIR/$es_filename"
echo "$translated" > "$es_post"

echo "blog: created Spanish post → $es_filename" >&2
