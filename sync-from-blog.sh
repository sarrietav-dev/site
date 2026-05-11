#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_SRC="$HOME/Documents/Writing/blog/"
POSTS_DST="$SITE_ROOT/_posts/"

# Convert to kebab-case and ensure YYYY-MM-DD prefix from frontmatter date or file mtime
rename_post() {
  local src="$1"
  local dst_dir="$2"
  local basename="${src##*/}"
  local name_only="${basename%.*}"
  local ext="${basename##*.}"

  # Extract date from frontmatter or use file mtime
  local date
  if [[ -f "$src" ]]; then
    date=$(sed -n '/^date: /p' "$src" | head -1 | sed 's/^date: *\([0-9\-]*\).*/\1/')
    if [[ -z "$date" ]]; then
      date=$(date -d "@$(stat -c %Y "$src")" +%Y-%m-%d)
    fi
  else
    return 0
  fi

  # Convert to kebab-case: lowercase, replace spaces/underscores with hyphens
  name_only=$(echo "$name_only" | tr '[:upper:]' '[:lower:]' | sed 's/[_[:space:]]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//g')

  # Remove existing date prefix if present
  name_only=$(echo "$name_only" | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-//')

  local new_name="$date-$name_only.$ext"
  local dst="$dst_dir/$new_name"

  if [[ "$src" != "$dst" ]]; then
    cp "$src" "$dst"
  fi
}

# Create destination
mkdir -p "$POSTS_DST"

# Copy and rename posts from blog dir
for post in "$BLOG_SRC"/*.md; do
  [[ -e "$post" ]] || continue
  rename_post "$post" "$POSTS_DST"
done

# Remove posts that no longer exist in source
for post in "$POSTS_DST"/*.md; do
  [[ -e "$post" ]] || continue
  basename="${post##*/}"
  # Find corresponding source file (ignore date prefix when matching)
  if ! find "$BLOG_SRC" -name "*.md" -exec basename {} \; | grep -qF "${basename#*-}"; then
    rm "$post"
  fi
done

# Commit and push (gracefully handle auth/connectivity issues)
cd "$SITE_ROOT"
git add -A
git diff --cached --quiet && { echo "blog: no changes"; exit 0; }

git commit -m "blog: sync $(date +%Y-%m-%d\ %H:%M)" || { echo "git commit failed"; exit 1; }

# Push; warn but don't fail if it can't (auth, network, or remote issue)
if ! git push 2>&1; then
  echo "⚠️  git push failed (auth, network, or remote issue) — commit is local"
  exit 0
fi
