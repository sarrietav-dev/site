#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_SRC="$HOME/Documents/Writing/blog/"
POSTS_DST="$SITE_ROOT/_posts/"

# Sync files
rsync -av --delete "$BLOG_SRC" "$POSTS_DST" || { echo "rsync failed"; exit 1; }

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
